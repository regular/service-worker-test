set -e
npx tre-compile index.js --force --no-csp > public/index.html
npx tre-compile sw.js --force --no-indexhtmlify > public/sw.js
cp manifest.json public
cp icon3.png icon2.png icon2_depth.jpg public
pushd public
npx pwa-asset-generator ../icon3.png -i index.html -m manifest.json --favicon --background black
popd
