set -e
npx tre-compile index.js --force  > public/index.html
npx tre-compile sw.js --force --no-indexhtmlify > public/sw.js
cp manifest.json public
pushd public
npx pwa-asset-generator ../icon.png -i index.html -m manifest.json --favicon
popd
