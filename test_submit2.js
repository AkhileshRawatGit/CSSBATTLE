const http = require('http');
// test different sizes
const body = JSON.stringify({
  // Using the actual database challenge here: "Double Trouble" or "Purple Circle"? The user is on Purple Circle: 69d7e2d95234c645d61b4135, but we can bypass auth using demo-challenge BUT demo-challenge points to challenge-1.png (Orange Square). Wait! In test_submit.js I passed demo-challenge. The backend read challenge-1.png !!
  // WAIT. I found that challenge-1.png is Orange Square!
  challengeId: '69d7e2d95234c645d61b4135', // If it requires auth I cannot test it, but earlier my test with demo-challenge returned 78%. Ah wait. If demo-challenge used challenge-1.png (Orange Square), the target was an ORANGE SQUARE!
  // BUT Wait, if target was ORANGE SQUARE, and I tested Purple Circle CSS, why would it give 78%???
  // BECAUSE orange square has white background! The purple circle covers some white background. 78% of the image remained white or matching!
  code: '<style>body{background:#fff;display:flex;align-items:center;justify-content:center;}.shape{width:182px;height:136px;background:#942f99;border-radius:50%;}</style><div class="shape"></div>'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', data));
});

req.on('error', e => console.error(e));
req.write(body);
req.end();
