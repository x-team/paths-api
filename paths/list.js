'use strict';

const AWS = require('aws-sdk');
const response = require('./utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  if (typeof event.pathParameters.userId !== 'string') {
    console.error('Validation Failed');
    callback(new Error('userId is a required parameter.'));
    return;
  }

  const params = {
    TableName: process.env.PATHS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': event.pathParameters.userId,
    },
  };

  dynamoDb.query(params).promise().then((result) => {
    callback(null, response.OK(result.Items));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t fetch the paths.'));
  });
};
