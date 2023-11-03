set -e
tre compile index.js --force > public/index.html
tre compile sw.js --force --no-indexhtmlify > public/sw.js

