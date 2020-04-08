// handler.js
const aws = require('aws-sdk')

const handler = async (event, context, callback) => {
  console.log(event)
  const userId = event.pathParameters.user_id;
  
  const eventBridge = new aws.EventBridge({apiVersion: '2015-10-07'}); 
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

const publish = handler

module.exports = { publish }