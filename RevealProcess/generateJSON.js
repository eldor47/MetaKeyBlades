const fs = require('fs');

const baseURI = 'https://mkb-public-files.s3.us-west-1.amazonaws.com/';

const generateAttribute = async(layer) => {
    var metaData = {
        description: "MetaKey Blades are a total of 1,500 weapons that act as keys throughout the metaverse. Each key allows you to mint 1 free NFT, on each future project. All weapons contain a celestial manastone fragment that is charged by the power of the gods. When your weapon is bonded to you through the blockchain, you are able to pass through the celestial gates and onto adventure.",
        image: `${baseURI}unrevealed.png`,
        name: layer.name
    }

    var json = JSON.stringify(metaData);
    fs.writeFileSync(`./unrevealed/json/${metaData.name}.json`, json, 'utf8');

    //console.log(metaData);
    return metaData;
}

async function createJSON(total){
    for(var i = 1; i <= total; i++){
        var layer = {
            name: i
        }
        await generateAttribute(layer)
    }
}

createJSON(1500)