console.log('The start');

const fs = require('fs');

const { createQR } = require('./generateQR.js')

const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(720, 1080);
const ctx = canvas.getContext("2d");

const rarities = require('./rarity.json');
const customBlades = require('./customBlades.json');

// Example hash... not exactly sure how i set this as it uploads yet
const baseURI = 'https://mkb-public-files.s3.us-west-1.amazonaws.com/';
//const baseURI = 'ipfs://QmaJN5GX9NRKzUJxWGrQA3Z1xzaCu5MnbuXC3pS6TGw8D5/';

const saveLayer = async (_canvas, imgName) => {
    try{
        fs.writeFileSync(`./images/combined/images/${imgName}`, _canvas.toBuffer("image/png"));
    } catch (e){
        console.log("File already exists")
    }
}

const drawLayer = async (baseImg, gripImg, gemImage, bgImage, qrImage, logoImage, imgName) => {
    var baseName = baseImg.src.split('/')[3].split('_')[1]
    var longBlades = ["Zero", "Melodic", "Beholder", "WorldEnder", "Soldier",
    "Mercenary", "Melodic", "Hunter", "Scarab", "Beholder", "DeathKnight", "WyrmSlayer"]
    ctx.drawImage(bgImage, -180, 0, 1080, 1080)
    ctx.drawImage(qrImage, 505, 845, 148*0.93, 148*0.93)
    ctx.drawImage(logoImage, 50, 835, 148, 148)
    if(longBlades.includes(baseName)){
        ctx.drawImage(baseImg, -180, 20, 1080, 1080)
        ctx.drawImage(gripImg, -180, 20, 1080, 1080)
        ctx.drawImage(gemImage, -180, 20, 1080, 1080)
    } else {
        ctx.drawImage(baseImg, -180, 0, 1080, 1080)
        ctx.drawImage(gripImg, -180, 0, 1080, 1080)
        ctx.drawImage(gemImage, -180, 0, 1080, 1080)
    }
    saveLayer(canvas, imgName)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const drawLayerGodly = async (bgImage, qrImage, logoImage, imgName) => {
    ctx.drawImage(bgImage, -180, 0, 1080, 1080)
    ctx.drawImage(qrImage, 505, 845, 148*0.93, 148*0.93)
    ctx.drawImage(logoImage, 50, 835, 148, 148)
    saveLayer(canvas, imgName)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const drawLayerBack = async (bgImage, logoImage, qrImage, imgName) => {
    ctx.drawImage(bgImage, -180, 0, 1080, 1080)
    ctx.drawImage(qrImage, 505, 845, 148*0.93, 148*0.93)
    ctx.drawImage(logoImage, 50, 835, 148, 148)
    saveLayer(canvas, imgName)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const generateAttribute = async(layer) => {
    var metaData = {
        description: "MetaKey Blades are a total of 1,500 weapons that act as keys throughout the metaverse. Each key allows you to mint 1 free NFT, on each future project. All weapons contain a celestial manastone fragment that is charged by the power of the gods. When your weapon is bonded to you through the blockchain, you are able to pass through the celestial gates and onto adventure.",
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
    //Forcing our giveaway blade :)
    var randIds = [];
    var customObjs = [{
        id: 1,
        name: 'Dark Ceres, Twilight Blade',
        swordbase: '60_Masterblade_62_Dark_Genesis_Metal',
        bladeType: '60_Masterblade',
        bladeMaterial: '62_Dark_Genesis_Metal',
        hilt: '62_Dark_Genesis_Hilt',
        manaShape: 'none',
        manaColor: 'none',
        manastone: 'none_noneManastone',
        bg: '04_Pink',
        mask: '04_PinkMask',
        fileName: '62_legendary',
        custom: true
      },
      {
        id: 2,
        name: 'Aria',
        swordbase: '16_Sun_18_Adamantite',
        bladeType: '16_Sun',
        bladeMaterial: '18_Adamantite',
        hilt: '16_Sun_Hilt',
        manaShape: '00_Round',
        manaColor: '07_Prismatic',
        manastone: '00_Round_07_PrismaticManastone',
        bg: '02_OrangeYellow'
      },
      {
        id: 3,
        name: 'Sunfire',
        swordbase: '12_Ranger_20_SunSteel',
        bladeType: '12_Ranger',
        bladeMaterial: '20_SunSteel',
        hilt: '12_Ranger_Hilt',
        manaShape: '00_Round',
        manaColor: '03_Orange',
        manastone: '00_Round_03_OrangeManastone',
        bg: '02_OrangeYellow'
      },
      {
        id: 4,
        name: 'Rekvar',
        swordbase: '18_Warrior_17_Orichalcum',
        bladeType: '18_Warrior',
        bladeMaterial: '17_Orichalcum',
        hilt: '18_Warrior_Hilt',
        manaShape: '00_Round',
        manaColor: '03_Orange',
        manastone: '00_Round_03_OrangeManastone',
        bg: '02_OrangeYellow'
      },
      {
        id: 5,
        name: 'Eternity',
        swordbase: '17_Paladin_24_ChronoSteel',
        bladeType: '17_Paladin',
        bladeMaterial: '24_ChronoSteel',
        hilt: '17_Paladin_Hilt',
        manaShape: '00_Round',
        manaColor: '00_Green',
        manastone: '00_Round_00_GreenManastone',
        bg: '00_BlueYellow'
      },
      {
        id: 6,
        name: 'Ghostblade',
        swordbase: '08_Mage_14_GhostFire',
        bladeType: '08_Mage',
        bladeMaterial: '14_GhostFire',
        hilt: '08_Mage_Hilt',
        manaShape: '01_Diamond',
        manaColor: '00_Green',
        manastone: '01_Diamond_00_GreenManastone',
        bg: '00_BlueYellow'
      },
      {
        id: 7,
        name: 'Pain',
        swordbase: '24_DemonHunter_23_Palladium',
        bladeType: '24_DemonHunter',
        bladeMaterial: '23_Palladium',
        hilt: '24_DemonHunter_Hilt',
        manaShape: '00_Round',
        manaColor: '06_Purple',
        manastone: '00_Round_06_PurpleManastone',
        bg: '06_Purple'
      },
      {
        id: 8,
        name: 'Bloodlust',
        swordbase: '15_Berserker_09_ScarletMetal',
        bladeType: '15_Berserker',
        bladeMaterial: '09_ScarletMetal',
        hilt: '15_Berserker_Hilt',
        manaShape: '00_Round',
        manaColor: '02_Red',
        manastone: '00_Round_02_RedManastone',
        bg: '08_RedWhite'
      },
      {
        id: 9,
        name: 'Deathwind',
        swordbase: '19_WindCutter_18_Adamantite',
        bladeType: '19_WindCutter',
        bladeMaterial: '18_Adamantite',
        hilt: '19_WindCutter_Hilt',
        manaShape: '00_Round',
        manaColor: '07_Prismatic',
        manastone: '00_Round_07_PrismaticManastone',
        bg: '07_Prismatic'
      },
      {
        id: 10,
        name: 'Inferno',
        swordbase: '11_Hellfire_06_DragonMetal',
        bladeType: '11_Hellfire',
        bladeMaterial: '06_DragonMetal',
        hilt: '11_Hellfire_Hilt',
        manaShape: '00_Round',
        manaColor: '04_Yellow',
        manastone: '00_Round_04_YellowManastone',
        bg: '02_OrangeYellow'
      },
      {
        id: 11,
        name: 'Sanctuary',
        swordbase: '10_Druid_02_ElfSteel',
        bladeType: '10_Druid',
        bladeMaterial: '02_ElfSteel',
        hilt: '10_Druid_Hilt',
        manaShape: '00_Round',
        manaColor: '00_Green',
        manastone: '00_Round_00_GreenManastone',
        bg: '10_Green'
      }
    ];
    for(var i = 0; i < customSwords.length; i++){
        var rand = Math.floor(Math.random() * (total-11+1)) + 11    
        console.log(rand)
        if(randIds.includes(rand)){
            i--;
        } else {
            randIds.push(rand)
            var sword = customSwords[i]
            var customObj = {
                id: randIds[i],
                name: sword.name ? sword.name : sword.legendaryName,
                swordbase: sword.bladeType + '_' + sword.bladeMaterial,
                bladeType: sword.bladeType,
                bladeMaterial: sword.bladeMaterial,
                hilt: sword.hilt + '_Hilt',
                manaShape: sword.manaShape,
                manaColor: sword.manaColor,
                manastone: sword.manaShape + '_' + sword.manaColor + 'Manastone',
                bg: sword.bg
            }

            if(sword["png file name"]){
                customObj.mask = sword.mask
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

    var totalNums = 1500;

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
                        var mask = customCheck.mask
                        var maskSub = mask.substring(0, mask.length-4)
                        bgImg = await loadImage(`./images/legendaries/${customCheck.fileName}.png`);

                        await createQR(maskSub, customCheck.id)
                        var qrImage = await loadImage(`./images/qrCode/${customCheck.id}_QR.png`);
                        var logoImage = await loadImage(`./images/logos/${maskSub}Logo.png`);

                        await drawLayerGodly(bgImg, qrImage, logoImage, `${i}.png`);

                    } else {
                        baseImg = await loadImage(`./images/swordbase/${customCheck.swordbase}.png`);
                        hiltImg = await loadImage(`./images/grips/${customCheck.hilt}.png`);
                        stoneImg = await loadImage(`./images/manastones/${customCheck.manastone}.png`);
                        bgImg = await loadImage(`./images/backgrounds/${customCheck.bg}.png`);
                        await createQR(customCheck.bg, customCheck.id)
                        qrImage = await loadImage(`./images/qrCode/${customCheck.id}_QR.png`);
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

                    if(customCheck.godly || customCheck.custom) {
                        var bladeType = customCheck.bladeType.substring(3, customCheck.bladeType.length)
                        bladeType = replaceAll(bladeType, '_', ' ')
                        layer.bladeType = bladeType
                        var swordBase = customCheck.bladeMaterial.substring(3, customCheck.bladeMaterial.length )
                        swordBase = replaceAll(swordBase, '_', ' ')
                        layer.bladeMaterial = swordBase
                        var hilt = customCheck.hilt.substring(3, customCheck.hilt.length)
                        hilt = replaceAll(hilt, '_', ' ')
                        layer.hilt = hilt
                        if(customCheck.manaShape !== 'none' || customCheck.manaShape !== 'none'){
                            var manaShape = customCheck.manaShape.substring(3, customCheck.manaShape.length)
                            manaShape = replaceAll(manaShape, '_', ' ')
                            layer.gemShape = manaShape
                            var manaColor = customCheck.manaColor
                            manaColor = replaceAll(manaColor, '_', ' ')
                            layer.gemName = manaColor
                        }
                        if(customCheck.godly){
                            var background = customCheck.bg.substring(3, customCheck.bg.length)
                            background = replaceAll(background, '_', ' ')
                            layer.background = background
                        }
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
                    await createQR(backgroundChoice, i)
                    qrImage = await loadImage(`./images/qrCode/${i}_QR.png`);
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

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
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
//      console.log(getCustomIds(1500, customBlades))
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