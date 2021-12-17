var Web3 = require("web3");
var AWS = require("aws-sdk");
const SmartContract = require("./SmartContract.json");

AWS.config.update({region: 'us-west-1'});
const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()

const infraURL = 'https://mainnet.infura.io/v3/b030d32a20264a89ad579a59e3bab9e2'

exports.handler = async (event) => {
    //TODO: If revealed == 1500 set showRank on all records to true
    var revealedNum = await connect()
    console.log(revealedNum)

    // Scan all revealed and return highest id
    var lastSword = await getLeastRevealDDB()
    var lastID = lastSword ? lastSword.name : 0
    console.log(lastID)
    
    //Grab swords from lastID -> revealedNum
    var swordsToReveal = await getSwordsToReveal(parseInt(lastID), parseInt(revealedNum))

    var dest = 'mkb-public-files'
    var source = 'mkb-non-public'
    var table = 'mkb-blades'
    //Loop through each sword and reveal it!
    for(var sword of swordsToReveal){
        //In loop put JSON and PNG files into public s3 bucket from private
        var copyParamsImg = {
            Bucket: dest,
            CopySource: source + '/images/' + sword.name + '.png',
            Key: sword.name + '.png'
        }

        var copyParamsJson = {
            Bucket: dest,
            CopySource: source + '/json/' + sword.name + '.json',
            Key: sword.name + '.json'
        }

        console.log('Moving s3 files to public bucket')
        try{
            await s3.copyObject(copyParamsImg).promise()
            await s3.copyObject(copyParamsJson).promise()
        } catch(e){
            console.log(e)
            return {
                errorMessage: "Error moving files!"
            }
        }

        //Set revealed flag to true in Dynamo
        var updateParams = {
            TableName:table,
            Key:{
                "name": sword.name
            },
            UpdateExpression: "set revealed = :r",
            ExpressionAttributeValues:{
                ":r":true
            },
            ReturnValues:"UPDATED_NEW"
        };

        var updateRes = await docClient.update(updateParams).promise();
        console.log(updateRes)

    }
    return {
        statusCode: 200
    }
}

async function connect(){
    var web3 = new Web3(infraURL)
    try {
            const SmartContractObj = new web3.eth.Contract(
                SmartContract.abi,
                // NetworkData.address
                // //Rinkeby test contract
                "0x8bEa2b168fb0E5935bd251B1BccB142FEd006171"
            );
            // Add listeners end
            var total = await SmartContractObj.methods.totalSupply().call()
            return total
    } catch (err) {
        console.log(err)
    }
    return 0
}

async function getSwordsToReveal(start, end) {
    var params = {
        TableName: "mkb-blades",
        ProjectionExpression: "#n, image",
        FilterExpression: "#n > :start and #n <= :end",
        ExpressionAttributeNames: {
            "#n": "name"
        },
        ExpressionAttributeValues: {
             ":start": start,
             ":end": end
        }
    }

    var res = await docClient.scan(params).promise()
    
    var swords = [];
    
    swords.push(...res.Items);
            
    while(res.LastEvaluatedKey){
        params.LastEvaluatedKey = res.LastEvaluatedKey;
        
        res = await docClient.scan(params).promise();
        swords.push(...res.Items);
    }

    swords = swords.sort((a, b) => {
        return a.name - b.name;
    });

    return swords;
}

async function getLeastRevealDDB() {
    var params = {
        TableName: "mkb-blades",
        ProjectionExpression: "#n, image, #r",
        FilterExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r": "revealed",
            "#n": "name"
        },
        ExpressionAttributeValues: {
             ":r": true
        }
    }
    var res = await docClient.scan(params).promise()
    
    var swords = [];
    
    swords.push(...res.Items);
            
    while(res.LastEvaluatedKey){
        params.LastEvaluatedKey = res.LastEvaluatedKey;
        
        res = await docClient.scan(params).promise();
        swords.push(...res.Items);
    }

    swords = swords.sort((a, b) => {
        return a.name - b.name;
    });

    return swords[swords.length-1]
}

//sam local invoke reveal