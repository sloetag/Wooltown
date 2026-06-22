const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'unsplash.com',
  path: '/napi/search/photos?query=fashion&per_page=30&page=1',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

let allIds = [];

const fetchPage = (page) => {
  if (page > 5) {
    fs.writeFileSync('ids.json', JSON.stringify(allIds));
    console.log('done, total:', allIds.length);
    return;
  }
  options.path = `/napi/search/photos?query=fashion+clothing&per_page=30&page=${page}`;
  https.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const ids = json.results.map(r => r.id);
        allIds.push(...ids);
        fetchPage(page + 1);
      } catch (e) {
        console.error(e);
      }
    });
  });
};

fetchPage(1);
