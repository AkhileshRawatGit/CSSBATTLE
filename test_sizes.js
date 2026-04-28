const http = require('http');

async function testSize(w) {
  return new Promise(resolve => {
    const body = JSON.stringify({
      challengeId: '69d7e2d95234c645d61b4135',
      code: `<style>body{background:#fff;display:flex;align-items:center;justify-content:center;}.shape{width:${w}px;height:${w}px;background:#942f99;border-radius:50%;}</style><div class="shape"></div>`
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
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const d = JSON.parse(data);
          resolve({w, sim: d.similarity});
        } catch(e) {
          resolve({w, err: true});
        }
      });
    });

    req.write(body);
    req.end();
  });
}

(async () => {
  for(let i=178; i<=185; i++) {
    const res = await testSize(i);
    console.log(res);
  }
})();
