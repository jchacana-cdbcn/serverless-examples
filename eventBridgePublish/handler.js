// handler.js
const aws = require('aws-sdk')
const middy = require('middy')
const { cors } = require('middy/middlewares')

const eventBridge = new aws.EventBridge({apiVersion: '2015-10-07'}); 

var publish = async (event, context, callback) => {
  console.log(event)
  const userId = event.pathParameters.user_id;
  
  const obj = {data: userId}
  await eventBridge.putEvents({
    Entries: [{
      Source: 'codurance.event', //<-- CHANGE ME for codurance.post
      DetailType: 'CoduranceEvent', //<-- CHANGE ME for Post
      Detail: JSON.stringify(obj)
    }]
  }, (err, data) => {
    if(err) console.log("ERROR", err.stack)
    else console.log(data)
  })
    
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {"success": "event published"},
      null,
      2
    )
  }
  return callback(null, response)
}
publish = middy(publish).use(cors())


var createPost = async (event, context, callback) => {
  console.log(event);
  var body;
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    body = event.body
  }
  console.log(body)
  await eventBridge.putEvents({
    Entries: [{
      Source: 'codurance.post',
      DetailType: 'CodurancePost',
      Detail: JSON.stringify(body)
    }]
  }, (err, data) => {
    if(err) console.log("ERROR", err.stack)
    else console.log(data)
  })

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {"success": "event published"},
      null,
      2
    )
  }
  return callback(null, response)
}
createPost = middy(createPost).use(cors())

module.exports = { publish, createPost }