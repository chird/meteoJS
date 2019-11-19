let resources = new meteoJS.modelviewer.NWPResources();
let model = new meteoJS.modelviewer.Variable({
  id: 'ICON'
});
resources.models.append(model);
['world', 'afr', 'noame', 'soame', 'antarc', 'noasi', 'soeasi', 'austr', 'eur'].forEach(regionId => {
  let name = regionId;
  switch (regionId) {
    case 'world': name = 'World'; break;
    case 'afr': name = 'Africa'; break;
    case 'noame': name = 'North America'; break;
    case 'soame': name = 'South America'; break;
    case 'antarc': name = 'Antartica'; break;
    case 'noasi': name = 'North Asia'; break;
    case 'soeasi': name = 'South Asia'; break;
    case 'austr': name = 'Australia'; break;
    case 'eur': name = 'Europe'; break;
  }
  resources.regions.append(new meteoJS.modelviewer.Variable({
    id: regionId,
    name
  }));
});
[0, 12, 24, 36].forEach(runOffset => {
  let date = new Date(Date.UTC(2019, 9, 2).valueOf() - runOffset * 3600 * 1000);
  resources.runs.append(new meteoJS.modelviewer.TimeVariable({
    datetime: date
  }));
});
['gpd', 'tt', 'wind', 'rft', 'omega', 'pmsl', 'rr'].forEach(paramId => {
  let name = paramId;
  switch (paramId) {
    case 'gpd': name = 'Geopotential'; break;
    case 'tt': name = 'Temperature'; break;
    case 'rft': name = 'Relatve humidity'; break;
    case 'pmsl': name = 'Mean sea level pressure'; break;
    case 'omega': name = 'Omega'; break;
    case 'rr': name = 'Precipitation'; break;
  }
  resources.fields.append(new meteoJS.modelviewer.Variable({
    id: paramId,
    name
  }));
});
[250, 300, 700, 850, 925, 0].forEach(level => {
  if (level == 0) {
    resources.levels.append(new meteoJS.modelviewer.Variable({
      id: '2m'
    }));
    resources.levels.append(new meteoJS.modelviewer.Variable({
      id: '10m'
    }));
  }
  resources.levels.append(new meteoJS.modelviewer.Variable({
    id: `${level}hPa`
  }));
});
['acc', 6, 24].forEach(accumulationId => {
  resources.accumulations.append(new meteoJS.modelviewer.Variable({
    id: accumulationId,
    name: (accumulationId == 6) ? '6h' : (accumulationId == 24) ? '24h' : 'Accumulated'
  }));
});
resources.regions.items.forEach(region => {
  resources.runs.items.forEach(run => {
    resources.fields.items.forEach(param => {
      [...Array(30).keys()].map(offset => offset*6).forEach(offset => {
        resources.levels.items.forEach(level => {
          if (param.id == 'rr')
            return;
          if (level.id == '2m' && param.id != 'temp')
            return;
          if (level.id == '10m' && param.id != 'wind')
            return;
          let offsetStr = '' + offset;
          while (offsetStr.length < 3) {
            offsetStr = '0' + offsetStr;
          }
          let matchesHPa = level.id.match(/^([0-9]+)hPa$/);
          let matchesM = level.id.match(/^([0-9]+)m$/);
          let levelStr = matchesHPa ? matchesHPa[1] : matchesM ? '000' : level.id;
          while (levelStr.length < 3) {
            levelStr = '0' + levelStr;
          }
          let runStr = moment.utc(run.datetime).format('YYYYMMDDHHmm');
          let url = `img/nwp/${param.id}_${region.id}_N_000${offsetStr}_000${levelStr}_${runStr}.png`;
          resources.appendImage({
            variables: [
              model,
              region,
              run,
              param,
              level
            ],
            run: run.datetime,
            offset: offset * 3600,
            url
          });
        });
        resources.accumulations.items.forEach(accumulation => {
          if (param.id != 'rr')
            return;
          if (offset == 0)
            return;
          let p = param.id + ((accumulation.id == 6) ? '06' : (accumulation.id == 24) ? '24' : 'ak');
          let offsetStr = '' + offset;
          while (offsetStr.length < 3) {
            offsetStr = '0' + offsetStr;
          }
          let runStr = moment.utc(run.datetime).format('YYYYMMDDHHmm');
          let url = `img/nwp/${p}_${region.id}_N_000${offsetStr}_000000_${runStr}.png`;
          resources.appendImage({
            variables: [
              model,
              region,
              run,
              param,
              accumulation
            ],
            run: run.datetime,
            offset: offset * 3600,
            url
          });
        });
      });
    });
  });
});