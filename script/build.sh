#!/usr/bin/env bash

set -e
cd "$(dirname "$0")/.."

./node_modules/.bin/tsc --module es6
./node_modules/.bin/rollup -c

./node_modules/.bin/dts-bundle --main build/src/main.d.ts --out main.d.ts --name "enumerables"
cp ./build/src/main.d.ts ./dist
