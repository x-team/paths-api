'use strict';

const AWS = require('aws-sdk');
const response = require('../utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.GOALS_TABLE,
    Key: {
      pathId: event.pathParameters.pathId,
      id: event.pathParameters.goalId
    },
  };

  dynamoDb.delete(params).promise().then((params) => {
    callback(null, response.OK({}));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t remove the goal item.'));
  });
};
