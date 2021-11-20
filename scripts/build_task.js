const fs = require('fs');
const execSync = require('child_process').execSync;
const dotenv = require('dotenv');
dotenv.config();

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let build;

rl.question("What are you building? Answer: 1 for custom, 2 for default. \n", function(answer) {
  if (answer.toLowerCase() === '1') {
    build = 'custom';
  } else if (answer.toLowerCase() === '2') {
    build = 'default';
  } 
  rl.close();
});

rl.on("close", function() {
  if (build) {
    generate_parcel_scripts();
    start_the_build();
  } else {
    console.log("\nBuild Cancelled, Please answer 1 for custom, 2 for default.");
  }
  process.exit(0);
});

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
    if (build === 'default') {
      console.log(`\nPreparing your default Cookiemunch files in ${path} please wait...\n`);
    } else {
      console.log(`\nPreparing your custom Cookiemunch files in ${path} please wait...\n`);
    }
    fs.rmdirSync(path);
  }
}

// run the parcel scripts
let parcel_scripts = '';

function generate_parcel_scripts() {
  let src;
  if (build === 'default') {
    src = 'src_default';
    parcel_scripts =
      'parcel build '+src+'/js/cookiemunch.js --global window -o /cookiemunch.min.js --no-content-hash --no-source-maps --experimental-scope-hoisting && ' +
      'parcel build '+src+'/images/cookiemunch.svg -o /cookiemunch.svg --no-content-hash --no-source-maps && ' +
      'parcel build '+src+'/images/cookiemunch_flat_dark.svg -o /cookiemunch_flat_dark.svg --no-content-hash --no-source-maps && ' +
      'parcel build '+src+'/images/cookiemunch_flat_light.svg -o /cookiemunch_flat_light.svg --no-content-hash --no-source-maps && ' +
      'parcel build '+src+'/scss/cookiemunch.scss -o /cookiemunch.min.css --no-content-hash --no-source-maps && ' +
      'parcel build '+src+'/scss/cookiemunch_flat_dark.scss -o /cookiemunch_flat_dark.min.css --no-content-hash --no-source-maps && ' +
      'parcel build '+src+'/scss/cookiemunch_flat_light.scss -o /cookiemunch_flat_light.min.css --no-content-hash --no-source-maps && ' +
      'parcel build src_element/cookie_munch_element.js -o /cookie_munch_element.min.js --no-source-maps --experimental-scope-hoisting';
  } else {
    src = 'src_custom';
    parcel_scripts =
      'parcel build '+src+'/js/cookiemunch_custom.js --global window -o /cookiemunch.min.js --no-content-hash --no-source-maps --experimental-scope-hoisting && ' +
      'parcel build '+src+'/images/cookiemunch_custom.svg -o /cookiemunch_custom.svg --no-content-hash --no-source-maps && ' +
      'parcel build '+src+'/scss/cookiemunch_custom.scss -o /cookiemunch_custom.min.css --no-content-hash --no-source-maps';
  }
}

function start_the_build() {
  // delete dist folder
  deleteFolderRecursive("./dist");
  console.log(execSync(parcel_scripts, {encoding: 'utf8'}));
  // LICENSE
  execSync("cp LICENSE dist/", {encoding: 'utf8'});
  console.log("dist\\LICENSE\n");
  // README
  execSync("cp README_NPM.md dist/README.md", {encoding: 'utf8'});
  console.log("dist\\README.md\n");
  // run npm_package.js
  console.log(execSync("node scripts/npm_package.js", {encoding: 'utf8'}));
  // final messages
  console.log(`Your ${build} Cookiemunch prodution ready files are now baked in ./dist, they smell delicious!\n`);
  console.log(`To see how they look:\n`);
  console.log(`npm run dist\n`);

  // to enable the following section create a .env with NPM_PACKAGE=true

  if (process.env.NPM_PACKAGE === 'true') {
    if (build === 'default') {
      console.log("NPM package can now be tested and published.\n");
      console.log("Test npm package:\nnpm pack dist/\n\nDeploy npm package:\nnpm publish dist/");
    } else {
      console.log("DO NOT PUBLISH THIS TO NPM!!!");
    }
  }
}