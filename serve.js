const path = require('path');

const appDir = path.join(__dirname, 'src', 'Trocaticket');
process.chdir(appDir);

require(path.join(appDir, 'server.js'));
