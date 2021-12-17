
var AWS = require("aws-sdk");
var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')

exports.handler = async (event) => {
    
    var signature = event.body.signature
    var publicAddress = event.body.address
    
    console.log(event)
    if(!event.body.address){
        return{
            statusCode: 400
        }
    }
    
    var docClient = new AWS.DynamoDB.DocumentClient()
    var params = {
        TableName: "users",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r": "address"
        },
        ExpressionAttributeValues: {
            ":r": event.body.address
        }
    }
    
    var res = await docClient.query(params).promise()

    var user = res.Items[0]

    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature
    });

    // The signature verification is successful if the address found with
    if (address.toLowerCase() === publicAddress.toLowerCase()) {
        return  {
            user,
            statusCode: 200
        }
    } else {
      return {
          statusCode: 401
      }
    }
};
