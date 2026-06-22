const https = require('https');

https.get('https://unsplash.com/s/photos/fashion', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g);
    if(matches) {
      console.log([...new Set(matches)]);
    } else {
      console.log('No matches');
    }
  });
}).on('error', (e) => {
  console.error(e);
});
