const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('src/pages', function(file) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    content = content.replace(/pt-32/g, 'pt-28 md:pt-32');
    content = content.replace(/pt-36/g, 'pt-28 md:pt-36');
    content = content.replace(/pb-24/g, 'pb-16 md:pb-24');
    content = content.replace(/px-6 sm:px-8/g, 'px-4 sm:px-6 md:px-8');

    if (original !== content) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});
