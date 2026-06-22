const fs = require('fs');
const original = fs.readFileSync('src/pages/Home.tsx', 'utf-8');
let content = original;

// Fix remaining paddings
content = content.replace(/gap-12 lg:gap-20/g, 'gap-8 lg:gap-20');
content = content.replace(/gap-16 pt-12/g, 'gap-10 md:gap-16 pt-8 md:pt-12');
content = content.replace(/gap-6 animate-item/g, 'gap-4 md:gap-6 animate-item');
content = content.replace(/p-8 md:p-12/g, 'p-6 md:p-12');

if (original !== content) {
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log('Fixed Home padding details');
}
