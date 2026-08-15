const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'manifest.json');
let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (let provider of manifest.providers) {
    if (provider.filename) {
        provider.url = `https://raw.githubusercontent.com/SatanMerde/TheFrenchPluginNuvio/main/${provider.filename}`;
        delete provider.filename;
    }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
console.log('Manifest updated!');
