'use strict';

const response = require('./utils/response');
const dynamoDb = require('../services/dynamodb')();

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

  dynamoDb.update(params).promise().then((result) => {
    callback(null, response.OK(result.Attributes));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t update the path item.'));
  });
};
