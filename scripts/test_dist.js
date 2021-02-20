const fs = require('fs');
const StaticServer = require('static-server');

const default_file = './dist/cookiemunch.min.css';
const custom_file = './dist/cookiemunch_custom.min.css';

try {
  if (fs.existsSync(default_file) && !fs.existsSync(custom_file)) {
    serve('default', 'serve/dist_default.html', 8234); 
  } else if (!fs.existsSync(default_file) && fs.existsSync(custom_file)) {
    serve('custom', 'serve/dist_custom.html', 8234);
  } else {
    console.log("No dist found\n");
    console.log('Try "npm run build"\n');
  }
} catch(err) {
  console.error(err);
}

function serve(type, file, port) {
  const server = new StaticServer({
    rootPath: '.',
    port: port,
    host: 'localhost',
    templates: {
      index: file
    }
  });
  console.log(`Starting server for ${type} dist.`);
  server.start(function () {
    console.log("\x1b[32m"); // green
    console.log('Server listening to', 'http://' + server.host + ':' + server.port);
    console.log("\x1b[0m"); // reset
  });
}
