const fs = require('fs');
const execSync = require('child_process').execSync;
const dotenv = require('dotenv');
dotenv.config();

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
    if (process.env.NPM_PACKAGE === 'true') {
      console.log(`Compiling files to ${path} please wait...\n`);
    } else {
      console.log(`Baking your custom Cookiemunch files in ${path} please wait...\n`);
    }
    fs.rmdirSync(path);
  }
}

// delete dist folder
deleteFolderRecursive("./dist");

// run the parcel scripts
let parcel_scripts = '';
if (process.env.NPM_PACKAGE === 'true') {
parcel_scripts =
  'parcel build src/js/cookiemunch.js --global window -o /cookiemunch.min.js --no-content-hash --no-source-maps --experimental-scope-hoisting && ' +
  'parcel build src/images/cookiemunch.svg -o /cookiemunch.svg --no-content-hash --no-source-maps && ' +
  'parcel build src/images/cookiemunch_flat_dark.svg -o /cookiemunch_flat_dark.svg --no-content-hash --no-source-maps && ' +
  'parcel build src/images/cookiemunch_flat_light.svg -o /cookiemunch_flat_light.svg --no-content-hash --no-source-maps && ' +
  'parcel build src/scss/cookiemunch.scss -o /cookiemunch.min.css --no-content-hash --no-source-maps && ' +
  'parcel build src/scss/cookiemunch_flat_dark.scss -o /cookiemunch_flat_dark.min.css --no-content-hash --no-source-maps && ' +
  'parcel build src/scss/cookiemunch_flat_light.scss -o /cookiemunch_flat_light.min.css --no-content-hash --no-source-maps';
} else {
parcel_scripts =
  'parcel build src/js/cookiemunch_custom.js --global window -o /cookiemunch_custom.min.js --no-content-hash --no-source-maps --experimental-scope-hoisting && ' +
  'parcel build src/images/cookiemunch_custom.svg -o /cookiemunch_custom.svg --no-content-hash --no-source-maps && ' +
  'parcel build src/scss/cookiemunch_custom.scss -o /cookiemunch_custom.min.css --no-content-hash --no-source-maps';
}


console.log(execSync(parcel_scripts, {encoding: 'utf8'}));

// LICENSE
execSync("cp LICENSE dist/", {encoding: 'utf8'});
console.log("dist\\LICENSE\n");

// README
execSync("cp README_NPM.md dist/README.md", {encoding: 'utf8'});
console.log("dist\\README.md\n");

// run npm_package.js
console.log(execSync("node scripts/npm_package.js", {encoding: 'utf8'}));

// final message
if (process.env.NPM_PACKAGE === 'true') {
  console.log("Test npm package:\nnpm pack dist/\n\nDeploy npm package:\nnpm publish dist/");
} else {
  console.log("Your custom Cookiemunch prodution ready files are now baked in ./dist, they smell delicious!");
}
