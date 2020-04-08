// handler.js
const middy = require('middy')
const { cors } = require('middy/middlewares')
const aws = require('aws-sdk')
const parse = aws.DynamoDB.Converter.output;
const ddb = new aws.DynamoDB({ apiVersion: '2012-08-10'})

const handler = async (event, context, callback) => {
  console.log(event)
  var userId = event.detail.data
  var params = {
    TableName: 'posts',
    Key: {
      'userId': { S: userId}
    },
    ProjectionExpression: 'posts'
  }

  return await new Promise((resolve, reject) => {
    ddb.getItem(params, function(err, data) {
      if (err) {
        console.log("Error", err)
        reject()
      } else {
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
const sub = middy(handler).use(cors()) // Adds CORS headers to responses

module.exports = { sub }
