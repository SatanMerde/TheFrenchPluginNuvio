const fs = require('fs');
const path = require('path');

const sources = [
    { id: 'french-stream', name: 'French Stream' },
    { id: 'vostfree', name: 'Vostfree' },
    { id: 'darkino', name: 'Darkino' },
    { id: 'cpasbien', name: 'Cpasbien' },
    { id: 'empire-streaming', name: 'Empire Streaming' },
    { id: 'papadustream', name: 'PapaDuStream' },
    { id: 'voirseries', name: 'VoirSeries' },
    { id: 'hdss', name: 'HDSS' },
    { id: 'sokroflix', name: 'Sokroflix' }
];

const srcDir = path.join(__dirname, 'src');
const templateDir = path.join(srcDir, 'wiflix'); // Use wiflix as template

sources.forEach(source => {
    const targetDir = path.join(srcDir, source.id);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 1. Copy and replace index.js
    let indexContent = fs.readFileSync(path.join(templateDir, 'index.js'), 'utf8');
    indexContent = indexContent.replace(/Wiflix/g, source.name);
    fs.writeFileSync(path.join(targetDir, 'index.js'), indexContent);

    // 2. Copy http.js directly
    fs.copyFileSync(path.join(templateDir, 'http.js'), path.join(targetDir, 'http.js'));

    // 3. Copy and replace extractor.js
    let extractorContent = fs.readFileSync(path.join(templateDir, 'extractor.js'), 'utf8');
    extractorContent = extractorContent.replace(/name: "Wiflix"/g, `name: "${source.name}"`);
    fs.writeFileSync(path.join(targetDir, 'extractor.js'), extractorContent);

    console.log(`Created boilerplate for ${source.name}`);
});

// Update manifest
const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

sources.forEach(source => {
    if (!manifest.providers.find(p => p.id === source.id)) {
        manifest.providers.push({
            id: source.id,
            name: source.name,
            filename: `providers/${source.id}.js`,
            supportedTypes: ["movie", "tv"],
            enabled: true
        });
    }
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
console.log('Manifest updated.');
