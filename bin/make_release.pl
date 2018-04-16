#!/usr/bin/perl

use strict;
use warnings;
use Getopt::Long;
use File::Spec;
use IPC::Run qw( run);
use DateTime;

my $warn_count = 0;

my $libdir = "src";
my $libname = "meteoJS";
my $qunit_filename = "bin/qunit-1.20.0.js";
my $runner_filename = "bin/runner.js";
my $release_name = undef;
my $tests_dir = "tests";
GetOptions("name=s" => \$release_name,
           "libname=s" => \$libname,
           "lib=s" => \$libdir,
           "test-dir=s" => \$tests_dir,
           "qunit=s" => \$qunit_filename,
           "runner=s" => \$runner_filename)
  or die("Error in command line arguments\n");

$libname = (defined $release_name) ? sprintf "%s.%s", $libname, $release_name : $libname;
my $lib_filename = sprintf "%s.js", $libname;
my $lib_filename_minified = sprintf "%s.min.js", $libname;
my $tests_filename = sprintf "tests.%s.html", $libname;
my $doc_dir = (defined $release_name) ?
  File::Spec->catdir("doc", $release_name) : "doc";

output_log("Erstelle Release '%s' der Dateien aus Ordner '%s'", $libname, $libdir);

my @lib_files = (
  "meteoJS.js",
  "meteoJS/calc.js",
  "meteoJS/sounding.js",
  "meteoJS/thermodynamicDiagram.js",
  "meteoJS/thermodynamicDiagram/coordinateSystem.js",
  "meteoJS/thermodynamicDiagram/coordinateSystem/skewTlogPDiagram.js",
  "meteoJS/thermodynamicDiagram/coordinateSystem/emagram.js",
  "meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram.js",
  "meteoJS/thermodynamicDiagram/tdDiagram.js",
  "meteoJS/thermodynamicDiagram/windprofile.js",
  "meteoJS/thermodynamicDiagram/hodograph.js",
  "meteoJS/thermodynamicDiagram/axes/axisLabels.js",
  "meteoJS/thermodynamicDiagram/axes/xAxis.js",
  "meteoJS/thermodynamicDiagram/axes/yAxis.js"
);
@lib_files = map { File::Spec->catdir($libdir, $_); } @lib_files;

# Library-Dateien zusammenfügen und in Datei $lib_filename schreiben
if (open (my $fh_lib, ">", $lib_filename)) {
  my $annotation = sprintf "/**
 * meteoJS. See https://github.com/chird/meteoJS
 * License: https://raw.githubusercontent.com/chird/meteoJS/master/LICENSE
 * Version: %s
 */\n1;\n", DateTime->now()->strftime("%Y-%m-%d");
  my @cmd_echo = ("echo", $annotation);
  my @cmd_cat = ("cat", "-", @lib_files);
  if (run \@cmd_echo, '|', \@cmd_cat,
          '>', $fh_lib, '2>', \&output_warning) {
    output_log("Zusammengefügte Library-Datei geschrieben: %s", $lib_filename);
    output_log("  Verwendete Dateien: %s", join(", ", @lib_files));
  }
  else {
    output_error("Fehler beim Zusammenfügen der Library-Dateien. (%s)", $?);
  }
  unless (close $fh_lib) {
    output_warning("Konnte Datei '%s' nicht schliessen", $lib_filename);
  }
}
else {
  output_error("Konnte Datei '%s' nicht öffnen.", $lib_filename);
}

# Test-HTML-Datei für runner.js schreiben
my @tests_files = get_test_files_in_directory($tests_dir);
printf "Dateien: %s\n", join(",", @tests_files);
if (open(my $fh, ">", $tests_filename)) {
  print_tests_html($fh, $lib_filename, $qunit_filename, \@tests_files);
  unless (close $fh) {
    output_warning("Konnte Datei '%s' nicht schliessen.", $tests_filename);
  }
}
else {
  output_error("Konnte Datei '%s' nicht öffnen.", $tests_filename);
}

# Tests ausführen
output_log("Führe Tests aus:");
if (run ["phantomjs", $runner_filename, $tests_filename],
        \undef, \&output_log, \&output_warning) {
  output_log("Tests erfolgreich ausgeführt.");
}
else {
  output_error("Fehler beim Ausführen der Tests. (%s)", $?);
}

# Minified JS erstellen
if (run ["uglifyjs"],
        "<", $lib_filename, ">", $lib_filename_minified, "2>", \&output_warning) {
  output_log("Minified Datei '%s' erstellt.", $lib_filename_minified);
}
else {
  output_error("Fehler beim Ausführen von uglify. (%s)", $?);
}

# Dokumentation erstellen
if (run ["jsdoc", sprintf("-d=%s", $doc_dir), "-p", @lib_files],
        \undef, \&output_log, \&output_warning) {
  output_log("Dokumentation in Ordner '%s' erstellt.", $doc_dir);
}
else {
  output_warning("Fehler beim Erstellen der Dokumentation.");
}

quit();

sub output_log {
  my $str = shift;
  $str = sprintf($str, @_) if ($#_ >= 0);
  printf "%s\n", $str;
}

sub output_warning {
  $warn_count++;
  my $str = shift;
  $str = sprintf($str, @_) if ($#_ >= 0);
  printf STDERR "Warning: %s\n", $str;
}

sub output_error {
  my $str = shift;
  $str = sprintf($str, @_) if ($#_ >= 0);
  printf STDERR "Error: %s\n", $str;
  quit(1);
}

sub quit {
  #clean_up();
  my $exit_code = ($warn_count > 0) ? 1 : 0;
  $exit_code ||= shift if ($#_ > -1);
  output_log("Beende mit Exit-Code: %d (Warnings: %d)", $exit_code, $warn_count);
  exit($exit_code);
}

sub clean_up {
  foreach my $file ($lib_filename, $tests_filename) {
    output_warning("Konnte '%s' nicht löschen.", $file)
      unless (!(-e $file) || unlink $file);
  }
}

sub print_tests_html {
  my $fh = shift;
  my $lib_file = shift;
  my $qunit_file = shift;
  my $files = shift;
  printf $fh "<!DOCTYPE html>
<html>
<head>
  <title>meteoJS Tests</title>
  <script src=\"https://code.jquery.com/jquery-3.3.1.min.js\"
          integrity=\"sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=\"
          crossorigin=\"anonymous\"></script>
  <script src=\"%s\"></script>
</head>
<body>
  <div id=\"qunit\"></div>
  <div id=\"qunit-fixture\"></div>
  <script src=\"%s\"></script>\n", $qunit_file, $lib_file;
  foreach my $file (@{$files}) {
    printf $fh "  <script src=\"%s\"></script>\n", $file;
  }
  print $fh "</body>
</html>";
}

sub get_test_files_in_directory {
  my $dir = shift;
  my @result = ();
  if (opendir(my $dh, $dir)) {
    while (my $file = readdir($dh)) {
      next if ($file =~ /^..?$/);
      my $filename = File::Spec->catfile($dir, $file);
      if (-d $filename) {
        push @result, get_test_files_in_directory($filename);
      }
      else {
        push @result, $filename
          if (-f $filename && $file =~ m/\.test\.js$/);
      }
    }
    unless (closedir $dh) {
      output_warning("Konnte Ordner '%s' nicht schliessen.", $dir);
    }
  }
  else {
    output_error("Konnte Ordner '%s' nicht öffnen.", $dir);
  }
  return @result;
}