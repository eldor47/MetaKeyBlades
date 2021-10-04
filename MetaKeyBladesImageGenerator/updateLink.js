
const fs = require('fs');

const metadata = require('./overall-metadata.json');

//Update this to update the base URI
const baseURI = 'ipfs://12345666';

for (var file of metadata){
    file.image = baseURI + file.image.split('/')[3]
    console.log(file.image)

    var json = JSON.stringify(file);
    fs.writeFileSync(`./images/combined/json/${file.name}.json`, json, 'utf8');
}
