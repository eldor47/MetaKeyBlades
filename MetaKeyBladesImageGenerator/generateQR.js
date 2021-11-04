// index.js -> bundle.js
var QRCode = require('qrcode')
const fs = require('fs');

const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(720, 1080);

const createQR = async(name) => {
    
    console.log(await QRCode.toCanvas(canvas, 'https://twitter.com/metakeyblades'));


    const ctx = canvas.getContext("2d");
    // get the image data object
    var image = ctx.getImageData(0, 0, 148, 148);
    // get the image data values 
    var imageData = image.data,
    length = imageData.length;
    // set every fourth value to 50
    newColor = {r:0,g:0,b:0, a:0};
    for (var i = 0, n = length; i < n; i += 4) {
        var r = imageData[i],
        g = imageData[i+1],
        b = imageData[i+2];

        // If its white then change it
        if(r == 255 && g == 255 && b == 255){ 
            // Change the white to whatever.
            imageData[i] = newColor.r;
            imageData[i+1] = newColor.g;
            imageData[i+2] = newColor.b;
            imageData[i+3] = newColor.a;
        }
    }
    // after the manipulation, reset the data
    image.data = imageData;
    // and put the imagedata back to the canvas
    ctx.putImageData(image, 0, 0);

    var imgClip =  await loadImage(`./images/qrCode/masks/${name}Mask.png`);

    /// change composite mode to use that shape
    ctx.globalCompositeOperation = 'source-in';

    /// draw the image to be clipped
    ctx.drawImage(imgClip, 0, 0);

    await saveLayer(canvas, `${name}QR.png`)
}

const saveLayer = async (_canvas, imgName) => {
    try{
        fs.writeFileSync(`./images/qrCode/${imgName}`, _canvas.toBuffer("image/png"));
    } catch (e){
        console.log(e)
        console.log("File already exists")
    }
}


createQR('00_BlueYellow')
createQR('01_GunMetal')
createQR('02_OrangeYellow')
createQR('03_BluePurple')
createQR('04_Pink')
createQR('05_Gold')
createQR('06_Purple')
createQR('07_Prismatic')
createQR('08_RedWhite')
createQR('09_Violet')
createQR('10_Green')
createQR('11_Blue')
createQR('12_MixedBerry')