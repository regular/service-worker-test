#/usr/bin/env bash
set -e
CAP=`cat .pwa-url-capability`
npx tre-compile index.js --force --no-csp > public/index.html
npx tre-compile sw.js --force --no-indexhtmlify > public/sw.js
sed "s/CAPABILITY-URL/$CAP/" manifest.json > public/manifest.json
cp icon3.png icon2.png icon2_depth.jpg public
pushd public
npx pwa-asset-generator ../icon3.png -i index.html -m manifest.json --favicon --background black
popd
