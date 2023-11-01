set -e
tre compile index.js --force > public/index.html
tre compile service.js --force --no-indexhtmlify > public/sw.js

