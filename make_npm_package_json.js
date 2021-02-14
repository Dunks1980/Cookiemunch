const fs = require('fs');
const stream = fs.createWriteStream("dist/package.json");
const path = require('path');
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));

let package_details = `` +
`{
  "name": "@dunks1980/cookiemunch",
  "version": "${PACKAGE.version}",
  "description": "A simple, customizable, minimal setup cookie plugin that allows your users to select which cookies to accept or decline.",
  "main": "cookiemunch.min.js",
  "author": "Ian Dunkerley",
  "license": "MIT",
  "homepage": "https://cookiemunch.dunks1980.com/",
  "keywords": ["Vue-js", "Vue", "Vue3", "cookie", "cookies", "popup", "plugin", "Cookiemunch", "dunks1980"],
  "repository": {
    "type": "git",
    "url": "https://github.com/Dunks1980/Cookiemunch"
  },
  "bugs": {
    "url": "https://github.com/Dunks1980/Cookiemunch/issues"
  }
}`;

stream.once('open', function(fd) {
  stream.write(package_details);
  stream.end();
});






