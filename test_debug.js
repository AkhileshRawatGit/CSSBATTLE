const http = require('http');

const PURPLE_CIRCLE_ID = '69d7e2d95234c645d61b4135';

const body = JSON.stringify({
  challengeId: PURPLE_CIRCLE_ID,
  code: '<style>*{margin:0;padding:0}body{background:#fff;display:flex;align-items:center;justify-content:center; width:400px; height:300px}.s{width:200px;height:200px;background:#800080;border-radius:50%;}</style><div class="s"></div>'
});

const req = http.request({
  hostname: 'localhost', port: 3000, path: '/api/submit', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RAW:', data);
  });
});
req.write(body);
req.end();
