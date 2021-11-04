console.log('The start');

const fs = require('fs');

const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(720, 1080);
const ctx = canvas.getContext("2d");

const rarities = require('./rarity.json');
const customBlades = require('./customBlades.json');

// Example hash... not exactly sure how i set this as it uploads yet
const baseURI = 'ipfs://QmaJN5GX9NRKzUJxWGrQA3Z1xzaCu5MnbuXC3pS6TGw8D5/';

const saveLayer = async (_canvas, imgName) => {
    try{
        fs.writeFileSync(`./images/combined/images/${imgName}`, _canvas.toBuffer("image/png"));
    } catch (e){
        console.log("File already exists")
    }
}

const drawLayer = async (baseImg, gripImg, gemImage, bgImage, qrImage, logoImage, imgName) => {
    ctx.drawImage(bgImage, -180, 0, 1080, 1080)
    ctx.drawImage(qrImage, 505, 845, 148*0.93, 148*0.93)
    ctx.drawImage(logoImage, 50, 835, 148, 148)
    ctx.drawImage(baseImg, -180, 0, 1080, 1080)
    ctx.drawImage(gripImg, -180, 0, 1080, 1080)
    ctx.drawImage(gemImage, -180, 0, 1080, 1080)
    saveLayer(canvas, imgName)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const drawLayerGodly = async (bgImage, imgName) => {
    ctx.drawImage(bgImage, -180, 0, 1080, 1080)
    // ctx.drawImage(qrImage, 505, 845, 148*0.93, 148*0.93)
    // ctx.drawImage(logoImage, 50, 835, 148, 148)
    saveLayer(canvas, imgName)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const drawLayerBack = async (bgImage, qrImage, logoImage, imgName) => {
    ctx.drawImage(bgImage, -180, 0, 1080, 1080)
    ctx.drawImage(qrImage, 505, 845, 148*0.93, 148*0.93)
    ctx.drawImage(logoImage, 50, 835, 148, 148)
    saveLayer(canvas, imgName)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const generateAttribute = async(layer) => {
    var metaData = {
        description: "Metakey Blades code generated NFT swords! :)",
        image: `${baseURI}${layer.name}.png`,
        name: layer.name,
        attributes: [
            {
                trait_type: "Blade Type", 
                value: layer.bladeType
            }, 
            {
                trait_type: "Blade Material", 
                value: layer.bladeMaterial
            }, 
            {
                trait_type: "Hilt", 
                value: layer.hilt
            },
            {
                trait_type: "Manastone", 
                value: layer.gemName
            },
            {
                trait_type: "Manastone Shape",
                value: layer.gemShape
            },
            {
                trait_type: "Background",
                value: layer.background
            }
        ]
    }

    if(layer.title){
        if(layer.godly){
            metaData.attributes.push({
                trait_type: "Godly Name",
                value: layer.title
            })
        } else {
            metaData.attributes.push({
                trait_type: "Legendary Name",
                value: layer.title
            })
        }
    }

    var json = JSON.stringify(metaData);
    fs.writeFileSync(`./images/combined/json/${metaData.name}.json`, json, 'utf8');

    //console.log(metaData);
    return metaData;
}

/** 
 * For rarity need to generate json of all the swordtypes and materials with their weights
 * 
 * Start a loop to generate TOTAL amount of nfts
 * loop must generate that TOTAL number, if can't reach total then weights need to be adjusted
 * 
 * There are 26 blade types so if x bladeType is weighted at 5, then at max 5 combos can have that type; after those 5 have been made total num of blade types decrements
 * 
 * not sure if i am thinking about this right just trying to understand how rarity would work in code
 * 
*/

async function getCustomIds(total, customSwords){
    var randIds = [];
    var customObjs = [];
    for(var i = 0; i < customSwords.length; i++){
        var rand = Math.floor(Math.random() * total) + 1
        if(randIds.includes(rand)){
            i--;
        } else {
            randIds.push(rand)
            var sword = customSwords[i]
            var customObj = {
                id: randIds[i],
                name: sword.name ? sword.name : sword.legendaryName,
                swordbase: sword.bladeType + '_' + sword.bladeMaterial,
                hilt: sword.hilt + '_Hilt',
                manastone: sword.manaShape + '_' + sword.manaColor + 'Manastone',
                bg: sword.bg
            }

            if(sword["png file name"]){
                customObj.fileName = sword["png file name"]
                customObj.custom = true
                if(sword["png file name"].includes('godly')){
                    customObj.godly = true
                }
            }
            customObjs.push(customObj)
        }
    }
    console.log(customObjs)
    console.log(randIds);
    return customObjs;
}

async function generateCombinationsRarity(){

    // example 16 total combos
    //console.log(rarities);

    var totalNums = 1000;

    var customs = await getCustomIds(totalNums, customBlades)

    console.log("end random")

    var createdCombos = [];
    var strMetaData = [];

    var metaData = [];

    var sortedSwordTypes = rarities.swordTypes.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });

    var sortedSwordMaterials = rarities.swordMaterials.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });
    
    var sortedHilts = rarities.hilts.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });

    var sortedRoundStones = rarities.gemRound.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });

    var sortedDiamondStones = rarities.gemDiamond.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });

    var sortedBackgrounds = rarities.backgrounds.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });
    
    var wasDupe = false;
    for(var i = 1; i <= totalNums; i++){
        var resSwordType = weightedRand(sortedSwordTypes);
        var resSwordMaterial = weightedRand(sortedSwordMaterials);
        var resSwordHilt = weightedRand(sortedHilts);
        var resManaRound = weightedRand(sortedRoundStones);
        var resManaDiamond = weightedRand(sortedDiamondStones);
    
        var randSwordNum = resSwordType();
        var swordChoice =  sortedSwordTypes[randSwordNum].id + '_' + sortedSwordTypes[randSwordNum].name;
    
        var randMaterialNum = resSwordMaterial();
        var materialChoice = sortedSwordMaterials[randMaterialNum].id + '_' + 
            sortedSwordMaterials[randMaterialNum].name;
        
        var randHiltNum = resSwordHilt();
        var hiltChoice =  sortedHilts[randHiltNum].id + '_' + sortedHilts[randHiltNum].name + '_Hilt';

        // Checks if it is an acceptable background for material choice
        var acceptableBackgrounds = [];
        for (var background of sortedBackgrounds){
            if(background.materials.includes(parseInt(sortedSwordMaterials[randMaterialNum].id))){
                acceptableBackgrounds.push(background);
            }
        }

        var resBackground = weightedRand(acceptableBackgrounds);
        var randomBackground = resBackground();
        var backgroundChoice =  acceptableBackgrounds[randomBackground].id + '_' + acceptableBackgrounds[randomBackground].name;

        var manaStoneNum;
        var manaStonechoice;
        // Choose manastone type give 50 50 chance for shape
        var manaRand = Math.floor(Math.random() * 10)
        var manaName;
        var manaShape;
        if (manaRand > 5){
            //Choose Round
            manaStoneNum = resManaRound();
            manaStonechoice = '00_Round_' + sortedRoundStones[manaStoneNum].id +
             '_' + sortedRoundStones[manaStoneNum].name + 'Manastone';
            manaName = sortedRoundStones[manaStoneNum].name
            manaShape = 'Round';
        } else{
            manaStoneNum = resManaDiamond();
            manaStonechoice = '01_Diamond_' + sortedDiamondStones[manaStoneNum].id + '_' +
             sortedDiamondStones[manaStoneNum].name + 'Manastone';
            manaName = sortedRoundStones[manaStoneNum].name
            manaShape = 'Diamond'
        }
    
        var swordCombo = swordChoice + '_' + materialChoice + '_' + hiltChoice + '_' + manaStonechoice;

        if(createdCombos.includes(swordCombo)){
            console.log("DUPLICATE")
            console.log("REROLLING:" + swordCombo)
            i--;
        } else {
            try{
                var customCheck = customs.find(x => x.id == i)
                if(customCheck){
                    console.log('Found ID: ' + i)
                    console.log(customCheck)
                    var baseImg
                    var hiltImg
                    var stoneImg 
                    var bgImg
                    var qrImage 
                    var logoImage

                    if(customCheck.godly || customCheck.custom){
                        bgImg = await loadImage(`./images/legendaries/${customCheck.fileName}.png`);
                        // var qrImage = await loadImage(`./images/qrCode/${customCheck.bg}QR.png`);
                        // var logoImage = await loadImage(`./images/logos/${customCheck.bg}Logo.png`);

                        await drawLayerGodly(bgImg, `${i}.png`);

                    } else {
                        baseImg = await loadImage(`./images/swordbase/${customCheck.swordbase}.png`);
                        hiltImg = await loadImage(`./images/grips/${customCheck.hilt}.png`);
                        stoneImg = await loadImage(`./images/manastones/${customCheck.manastone}.png`);
                        bgImg = await loadImage(`./images/backgrounds/${customCheck.bg}.png`);
                        qrImage = await loadImage(`./images/qrCode/${customCheck.bg}QR.png`);
                        logoImage = await loadImage(`./images/logos/${customCheck.bg}Logo.png`);

                        await drawLayer(baseImg, hiltImg, stoneImg, bgImg, qrImage, logoImage, `${i}.png`);
                    }

                    var layer = {
                        bladeType: customCheck.swordbase.split('_')[1],
                        bladeMaterial: customCheck.swordbase.split('_')[3],
                        hilt: customCheck.hilt.split('_')[1],
                        gemName: customCheck.manastone.includes('none') ? "None" : 
                        customCheck.manastone.split('_')[3].substring(0, customCheck.manastone.split('_')[3].length - 9),
                        gemShape: customCheck.manastone.includes('none') ? "None" : customCheck.manastone.split('_')[1],
                        background: customCheck.bg.split('_')[1],
                        name: i,
                        title: customCheck.name  
                    }

                    if(customCheck.godly){
                        layer.godly = true;
                    }

                    metaData.push(await generateAttribute(layer))

                    swordCombo = customCheck.swordbase + '_' + customCheck.hilt + '_' + customCheck.manastone;

                    createdCombos.push(swordCombo);
                    strMetaData.push(`#${i}_${swordCombo}`);
                    console.log("SWORD #" + i + ":" + swordCombo);

                } else{
                    var baseImg = await loadImage(`./images/swordbase/${swordChoice}_${materialChoice}.png`);
                    var hiltImg = await loadImage(`./images/grips/${hiltChoice}.png`);
                    var stoneImg = await loadImage(`./images/manastones/${manaStonechoice}.png`);
                    var bgImg = await loadImage(`./images/backgrounds/${backgroundChoice}.png`);
                    var qrImage = await loadImage(`./images/qrCode/${backgroundChoice}QR.png`);
                    var logoImage = await loadImage(`./images/logos/${backgroundChoice}Logo.png`);

                    await drawLayer(baseImg, hiltImg, stoneImg, bgImg, qrImage, logoImage, `${i}.png`);

                    var layer = {
                        bladeType: sortedSwordTypes[randSwordNum].name,
                        bladeMaterial: sortedSwordMaterials[randMaterialNum].name,
                        hilt: sortedHilts[randHiltNum].name,
                        gemName: manaName,
                        gemShape: manaShape,
                        background: acceptableBackgrounds[randomBackground].name,
                        name: i
                    }

                    metaData.push(await generateAttribute(layer))

                    createdCombos.push(swordCombo);
                    strMetaData.push(`#${i}_${swordCombo}`);
                    console.log("SWORD #" + i + ":" + swordCombo);
                }
            } catch(e){
                console.log(e);
                i--;
            }
        }
    }

    console.log(createdCombos.length)
    console.log(wasDupe);

    var jsonStrMeta = JSON.stringify(metaData);
    console.log(jsonStrMeta);


    fs.writeFileSync('overall-metadata.json', jsonStrMeta, 'utf8');


    /**
     * 3 Most Common
     * 50%
     * 2 Uncommon
     * 40%
     * Rare
     * 10%
     */

}

async function generateBackgroundCombos(color) {

    var bgImg = await loadImage(`./images/backgrounds/${color}.png`);
    var qrImage = await loadImage(`./images/qrCode/${color}QR.png`);
    var logoImage = await loadImage(`./images/logos/${color}Logo.png`);
    var imgName = color + '.png'

    drawLayerBack(bgImg, qrImage, logoImage, imgName);
}

function weightedRand(spec) {
    var i, j, table=[];
    for (i in spec) {
        // The constant 10 below should be computed based on the
        // weights in the spec for a correct and optimal table size.
        // E.g. the spec {0:0.999, 1:0.001} will break this impl.
        //console.log(spec)
        var weight;
        if(spec[i].rarity == 3){
            weight = 0.5
        }
        if(spec[i].rarity == 2){
            weight = 0.4
        }
        if(spec[i].rarity == 1){
            weight = 0.1
        }

        for (j=0; j<weight*10; j++) {
            table.push(i);
        }
    }
    return function() {
      return table[Math.floor(Math.random() * table.length)];
    }
  }


  generateCombinationsRarity();
//   generateBackgroundCombos("00_BlueYellow");
//   generateBackgroundCombos("01_GunMetal");
//   generateBackgroundCombos("02_OrangeYellow");
//   generateBackgroundCombos("03_BluePurple");
//   generateBackgroundCombos("04_Pink");
//   generateBackgroundCombos("05_Gold");
//   generateBackgroundCombos("06_Purple");
//   generateBackgroundCombos("07_Prismatic");
//   generateBackgroundCombos("08_RedWhite");
//   generateBackgroundCombos("09_Violet");
//   generateBackgroundCombos("10_Green");
//   generateBackgroundCombos("11_Blue");
//   generateBackgroundCombos("12_MixedBerry");