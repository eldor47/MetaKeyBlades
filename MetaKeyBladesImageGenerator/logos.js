
const fs = require('fs');

const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(160, 180);

const createLogo = async(name) => {
    const ctx = canvas.getContext("2d");

    var base =  await loadImage(`./images/logos/masks/TinyThreeSwords.png`);
    var imgClip =  await loadImage(`./images/logos/masks/${name}Mask.png`);

    /// draw the image to be clipped
    ctx.drawImage(base, 0, 0);

    ctx.globalCompositeOperation = 'source-in';

    ctx.drawImage(imgClip, 0, 0, 160, 180);

    await saveLayer(canvas, `${name}Logo.png`)
}

const saveLayer = async (_canvas, imgName) => {
    try{
        fs.writeFileSync(`./images/logos/${imgName}`, _canvas.toBuffer("image/png"));
    } catch (e){
        console.log(e)
        console.log("File already exists")
    }
}


createLogo('00_BlueYellow')
createLogo('01_GunMetal')
createLogo('02_OrangeYellow')
createLogo('03_BluePurple')
createLogo('04_Pink')
createLogo('05_Gold')
createLogo('06_Purple')
createLogo('07_Prismatic')
createLogo('08_RedWhite')
createLogo('09_Violet')
createLogo('10_Green')
createLogo('11_Blue')
createLogo('12_MixedBerry')