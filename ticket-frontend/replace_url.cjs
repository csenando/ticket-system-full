const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('http://localhost:3000')) {
            let newContent = content.replace(/http:\/\/localhost:3000/g, 'https://ticket-backend-api-lp89.onrender.com');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Replaced in', filePath);
        }
    }
});
