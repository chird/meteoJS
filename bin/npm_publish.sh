#!/bin/bash

cp -R src/ build/
if [ $? -eq 0 ]; then
    echo "src/ copied to build/"
    cp package.json build/ && cp README.md build/ && cp LICENSE build/
    if [ $? -eq 0 ]; then
        echo "package.json/README/LICENSE copied to build/"
        cd build/
        if [ $? -eq 0 ]; then
            echo "chdir to build/"
            npm publish
            cd ..
        else
            echo "Couldn't chdir to build/"
        fi
    else
        echo "Couldn't copy package.json to build/"
    fi
    rm -fR build/
    if [ $? -eq 0 ]; then
        echo "build/ deleted"
    fi
else
    echo "Couldn't copy src/ to build/"
fi
