const https = require('https');
https.get({
  host: "unsplash.com",
  path: "/s/photos/fashion",
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
}, res => {
  let d = "";
  res.on("data", c => d += c);
  res.on("end", () => {
    const ids = Array.from(d.matchAll(/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/g)).map(m=>m[1]);
    console.log(Array.from(new Set(ids)).join(","));
  });
})
