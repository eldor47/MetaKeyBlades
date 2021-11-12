
const fs = require('fs');

const metadata = require('./overall-metadata.json');

for (var file of metadata){
    file.description = "MetaKey Blades are a total of 1,500 weapons that act as keys throughout the metaverse. Each key allows you to mint 1 free NFT, on each future project. All weapons contain a celestial manastone fragment that is charged by the power of the gods. When your weapon is bonded to you through the blockchain, you are able to pass through the celestial gates and onto adventure."
    console.log(file.name)
    console.log(file.description)

    var json = JSON.stringify(file);
    fs.writeFileSync(`./images/combined/json/${file.name}.json`, json, 'utf8');
}
