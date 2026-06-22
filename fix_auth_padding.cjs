const fs = require('fs');

['Login.tsx', 'Register.tsx', 'ForgotPassword.tsx'].forEach(page => {
  const file = 'src/pages/' + page;
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/p-10 md:p-14/g, 'p-6 sm:p-10 md:p-14');
  fs.writeFileSync(file, content);
  console.log(`Updated auth paddings in ${file}`);
});
