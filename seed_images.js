const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const p = await browser.newPage();
  await p.setViewport({width: 400, height: 300, deviceScaleFactor: 1});

  const writeChallenge = async (file, html) => {
    await p.setContent(html);
    await new Promise(r => setTimeout(r, 100));
    const buf = await p.screenshot({type: 'png'});
    fs.writeFileSync('public/challenges/' + file, buf);
    console.log('Generated ' + file);
  };

  await writeChallenge('challenge-1.png', '<style>*{margin:0;padding:0}body{background:#fff;display:flex;align-items:center;justify-content:center; width:400px; height:300px}.s{width:150px;height:150px;background:#ff6b35;}</style><div class="s"></div>');
  await writeChallenge('challenge-2.png', '<style>*{margin:0;padding:0}body{background:#fff;display:flex;align-items:center;justify-content:center; width:400px; height:300px}.s{width:200px;height:200px;background:#800080;border-radius:50%;}</style><div class="s"></div>');
  await writeChallenge('challenge-3.png', '<style>*{margin:0;padding:0}body{background:#111;display:flex;align-items:center;justify-content:center; width:400px; height:300px}.s{width:150px;height:150px;background:#4caf50;border-radius:50%;position:absolute;left:80px;}.s2{width:150px;height:150px;background:#ffc107;border-radius:50%;position:absolute;right:80px;}</style><div class="s"></div><div class="s2"></div>');
  await writeChallenge('challenge-4.png', '<style>body{background:#5D3FD3;margin:0}div{position:absolute;box-sizing:border-box}.b{width:150px;height:150px;border:25px solid;border-radius:50%;top:110px;border-top-color:#0000}.h{width:80px;height:80px;border-radius:50%;top:40px}.k{border-color:#000;left:75px}.w{border-color:#fff;left:175px}.hk{background:#000;left:110px}.hw{background:#fff;left:210px}</style><div class="b w"></div><div class="b k"></div><div class="h hw"></div><div class="h hk"></div>');

  await browser.close();
  process.exit();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
