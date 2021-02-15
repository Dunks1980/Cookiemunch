const fs = require('fs');
const StaticServer = require('static-server');

const default_file = './dist/cookiemunch.min.css';
const custom_file = './dist/cookiemunch_custom.min.css';

try {
  if (fs.existsSync(default_file) && !fs.existsSync(custom_file)) {
    default_dist();
  } else if (!fs.existsSync(default_file) && fs.existsSync(custom_file)) {
    custom_dist();
  } else {
    console.log("No dist found\n");
    console.log('Try "npm run build"\n');
  }
} catch(err) {
  console.error(err);
}

function default_dist() {
  const server = new StaticServer({
    rootPath: '.',
    port: 8234,
    host: 'localhost',
    templates: {
      index: 'index.html'
    }
  });
  console.log('Starting server for default dist.');
  server.start(function () {
    console.log("\x1b[32m"); // green
    console.log('Server listening to', 'http://' + server.host + ':' + server.port);
    console.log("\x1b[0m"); // reset
  });
}

function custom_dist() {
  const server = new StaticServer({
    rootPath: '.',
    port: 8235,
    host: 'localhost',
    templates: {
      index: 'index_custom.html'
    }
  });
  console.log('Starting server for custom dist.');
  server.start(function () {
    console.log("\x1b[32m"); // green
    console.log('Server listening to', 'http://' + server.host + ':' + server.port);
    console.log("\x1b[0m"); // reset
  });
}