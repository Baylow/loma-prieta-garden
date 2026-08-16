const https = require('https');

https.get('https://www.loma.k12.ca.us/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const hexRegex = /#[0-9a-fA-F]{6}\b/g;
    const matches = data.match(hexRegex);
    if (matches) {
      const uniqueColors = [...new Set(matches)];
      console.log('Found hex colors in HTML:');
      console.log(uniqueColors.join(', '));
    } else {
      console.log('No hex colors found.');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
