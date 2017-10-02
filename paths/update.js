'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const response = require('./utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(null, response.BadRequest('Couldn\'t update the path item.'));
    return;
  }

  const params = {
    TableName: process.env.PATHS_TABLE,
    Key: {
      userId: event.pathParameters.userId,
      id: event.pathParameters.pathId,
    },
    ExpressionAttributeNames: {
      '#path_name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #path_name = :name, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.BadRequest('Couldn\'t update the path item.'));
      return;
    }

    callback(null, response.OK(result.Attributes));
  });
};
