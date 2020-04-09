// handler.js
const middy = require('middy')
const { cors } = require('middy/middlewares')
const aws = require('aws-sdk')
const parse = aws.DynamoDB.Converter.output;
const ddb = new aws.DynamoDB({ apiVersion: '2012-08-10'})
const docClient = new aws.DynamoDB.DocumentClient()

const handler = async (event, context, callback) => {
  console.log(event)
  var body = JSON.stringify(event.detail)
  console.log(body);
  var params = {
    TableName: 'posts',
    Key: {
      userId: "1234"
    },
    UpdateExpression: "SET #posts  = list_append(#posts, :post)",
    ExpressionAttributeNames: { "#posts" : "posts"},
    ExpressionAttributeValues: {":post": [event.detail]},
    ReturnValues : "UPDATED_NEW"
    
  }

  return await new Promise((resolve, reject) => {
    
    docClient.update(params, function(err, data) {
      console.log("@ docClient update")
      if (err) {
        console.log("Error", err)
        reject()
      } else {
        console.log("I got a response ", data)
        const response = {
          statusCode: 200,
          body: JSON.stringify(
            parse({ "M": data.Item}).posts,
            null,
            2
          )
        }
        console.log(response);
        return callback(null, response)
      }
    })
  })
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
const createPost = middy(handler).use(cors()) // Adds CORS headers to responses

module.exports = { createPost }
