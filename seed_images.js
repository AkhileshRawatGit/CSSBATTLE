const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const p = await browser.newPage();
  await p.setViewport({ width: 400, height: 300, deviceScaleFactor: 1 });

  const writeChallenge = async (file, html) => {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 400px; height: 300px; overflow: hidden; background: #ffffff; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    await p.setContent(fullHtml);
    await new Promise(r => setTimeout(r, 100));
    const buf = await p.screenshot({ type: 'png' });
    fs.writeFileSync('public/challenges/' + file, buf);
    console.log('Generated ' + file);
  };

  // 1. The Radial Maze (Medium) - FIXED FOR BORDER-BOX
  await writeChallenge('challenge-1.png', '<style>body{background:#1A4341;margin:0;width:400px;height:300px}.r,.c{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.r{border:15px solid #F3AC3C;border-radius:50%}.r1{width:200px;height:200px;border-right-color:transparent;transform:translate(-50%,-50%) rotate(45deg)}.r2{width:150px;height:150px;border-top-color:transparent;border-right-color:transparent;transform:translate(-50%,-50%) rotate(45deg)}.r3{width:100px;height:100px;border-top-color:transparent;border-right-color:transparent;border-bottom-color:transparent;transform:translate(-50%,-50%) rotate(45deg)}.c{width:30px;height:30px;background:#E35064;border-radius:50%}</style><div class="r r1"></div><div class="r r2"></div><div class="r r3"></div><div class="c"></div>');

  // 2. The Mechanical Eye (Hard) - FIXED FOR BORDER-BOX (.o width/height changed to 170px)
  await writeChallenge('challenge-2.png', '<style>body{background:#111;margin:0;width:400px;height:300px;display:flex;align-items:center;justify-content:center}.o{width:170px;height:170px;border:10px solid #F2BC1B;border-radius:50%;position:relative;display:flex;align-items:center;justify-content:center}.i{width:80px;height:80px;background:radial-gradient(#E35064,#F2BC1B);border-radius:50%;position:relative}.p{width:30px;height:30px;background:#111;border-radius:50%;position:absolute;top:25px;left:25px}.b{position:absolute;width:10px;height:10px;background:#F2BC1B;border-radius:50%}.b1{top:-20px;left:70px}.b2{bottom:-20px;left:70px}.b3{left:-20px;top:70px}.b4{right:-20px;top:70px}</style><div class="o"><div class="i"><div class="p"></div></div><div class="b b1"></div><div class="b b2"></div><div class="b b3"></div><div class="b b4"></div></div>');

  await browser.close();
  process.exit();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
