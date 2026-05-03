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

  // 1. The Radial Maze (Medium)
  await writeChallenge('challenge-1.png', '<style>body{background:#1A4341;margin:0;display:flex;align-items:center;justify-content:center;width:400px;height:300px}.r{border:15px solid #F3AC3C;border-radius:50%;position:absolute;border-top-color:transparent}.r1{width:200px;height:200px;transform:rotate(45deg)}.r2{width:150px;height:150px;transform:rotate(135deg);border-right-color:transparent}.r3{width:100px;height:100px;transform:rotate(225deg);border-bottom-color:transparent;border-left-color:transparent}.c{width:30px;height:30px;background:#E35064;border-radius:50%;position:absolute}</style><div class="r r1"></div><div class="r r2"></div><div class="r r3"></div><div class="c"></div>');

  // 2. The Mechanical Eye (Hard)
  await writeChallenge('challenge-2.png', '<style>body{background:#111;margin:0;display:flex;align-items:center;justify-content:center;width:400px;height:300px}.o{width:150px;height:150px;border:10px solid #F2BC1B;border-radius:50%;position:relative;display:flex;align-items:center;justify-content:center}.i{width:80px;height:80px;background:radial-gradient(#E35064,#F2BC1B);border-radius:50%;position:relative}.p{width:30px;height:30px;background:#111;border-radius:50%;position:absolute;top:25px;left:25px}.b{position:absolute;width:10px;height:10px;background:#F2BC1B;border-radius:50%}.b1{top:-20px;left:70px}.b2{bottom:-20px;left:70px}.b3{left:-20px;top:70px}.b4{right:-20px;top:70px}</style><div class="o"><div class="i"><div class="p"></div></div><div class="b b1"></div><div class="b b2"></div><div class="b b3"></div><div class="b b4"></div></div>');

  await browser.close();
  process.exit();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
