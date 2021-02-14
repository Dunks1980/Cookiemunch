var cmd = '' +
'parcel build src/js/cookiemunch.js --global window -o /cookiemunch.min.js --no-content-hash --no-source-maps --experimental-scope-hoisting & ' +
'node make_npm_package_json.js & ' +
'cp README.md dist/ & ' +
'cp LICENSE dist/ & ' +
'parcel build src/images/cookiemunch.svg -o /cookiemunch.svg --no-content-hash --no-source-maps & ' +
'parcel build src/images/cookiemunch_flat_dark.svg -o /cookiemunch_flat_dark.svg --no-content-hash --no-source-maps & ' +
'parcel build src/images/cookiemunch_flat_light.svg -o /cookiemunch_flat_light.svg --no-content-hash --no-source-maps & ' +
'parcel build src/scss/cookiemunch.scss -o /cookiemunch.min.css --no-content-hash --no-source-maps & ' +
'parcel build src/scss/cookiemunch_flat_dark.scss -o /cookiemunch_flat_dark.min.css --no-content-hash --no-source-maps & ' +
'parcel build src/scss/cookiemunch_flat_light.scss -o /cookiemunch_flat_light.min.css --no-content-hash --no-source-maps';


var fs = require('fs');
var execSync = require('child_process').execSync;

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    fs.rmdirSync(path);
  }
}

deleteFolderRecursive("./dist");
console.log(execSync(cmd, {encoding: 'utf8'}));