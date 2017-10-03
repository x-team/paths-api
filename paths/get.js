'use strict';

const AWS = require('aws-sdk');
const response = require('./utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.PATHS_TABLE,
    Key: {
      userId: event.pathParameters.userId,
      id: event.pathParameters.pathId,
    },
  };

  dynamoDb.get(params).promise().then((result) => {
    callback(null, response.OK(result.Item));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t fetch the path item.'));
  });
};
