'use strict';

const response = require('./utils/response');
const dynamoDb = require('../services/dynamodb')();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.PATHS_TABLE,
    Key: {
      userId: event.pathParameters.userId,
      id: event.pathParameters.pathId,
    },
  };

  dynamoDb.delete(params).promise().then(() => {
    callback(null, response.OK({}));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t remove the path item.'));
  });
};
