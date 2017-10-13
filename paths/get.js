'use strict';

const response = require('./utils/response');
const dynamoDb = require('../services/dynamodb')();

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
