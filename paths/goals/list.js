'use strict';

const response = require('../utils/response');
const dynamoDb = require('../../services/dynamodb')();

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.GOALS_TABLE,
    KeyConditionExpression: 'pathId = :pathId',
    ExpressionAttributeValues: {
      ':pathId': event.pathParameters.pathId,
    },
  };

  dynamoDb.query(params).promise().then((result) => {
    callback(null, response.OK(result.Items));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t fetch the goals.'));
  });
};
