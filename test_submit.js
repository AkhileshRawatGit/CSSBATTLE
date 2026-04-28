const http = require('http');

// Purple Circle challenge ID from DB
const PURPLE_CIRCLE_ID = '69d7e2d95234c645d61b4135';

function sendTest(label, code) {
  return new Promise(resolve => {
    const body = JSON.stringify({ challengeId: PURPLE_CIRCLE_ID, code });
    const req = http.request({
      hostname: 'localhost', port: 3000, path: '/api/submit', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const d = JSON.parse(data);
        console.log(`${label}: similarity=${d.similarity}% | score=${d.score}`);
        resolve();
      });
    });
    req.write(body);
    req.end();
  });
}

(async () => {
  // Test 1: PERFECT match (same code used to generate the seed image)
  await sendTest(
    '✅ Perfect Purple Circle',
    '<style>*{margin:0;padding:0}body{background:#fff;display:flex;align-items:center;justify-content:center; width:400px; height:300px}.s{width:200px;height:200px;background:#800080;border-radius:50%;}</style><div class="s"></div>'
  );

  // Test 2: Wrong color
  await sendTest(
    '❌ Wrong color (red)',
    '<style>*{margin:0;padding:0}body{background:#fff;display:flex;align-items:center;justify-content:center; width:400px; height:300px}.s{width:200px;height:200px;background:#ff0000;border-radius:50%;}</style><div class="s"></div>'
  );

  // Test 3: Blank white canvas  
  await sendTest(
    '❌ Blank white',
    '<style>body{background:#fff;margin:0}</style>'
  );
})();
