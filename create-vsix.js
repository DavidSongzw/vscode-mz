const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const packageJson = require('./package.json');
const version = packageJson.version;
const name = packageJson.name;

// 创建 .vsix 文件
const output = fs.createWriteStream(`${name}-${version}.vsix`);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
    console.log(`✓ Created ${name}-${version}.vsix (${archive.pointer()} bytes)`);
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

// 添加必要的文件
const filesToInclude = [
    'extension.vsixmanifest',
    '[Content_Types].xml',
    'package.json',
    'README.md',
    'CHANGELOG.md',
    'logo.jpg',
    'out/**',
    'images/**',
    'node_modules/vscode/**'
];

// ... 这个方法比较复杂，让我换一个思路
