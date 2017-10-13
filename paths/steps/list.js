'use strict';

const response = require('../utils/response');
const dynamoDb = require('../../services/dynamodb')();

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.STEPS_TABLE,
    KeyConditionExpression: 'goalId = :goalId',
    ExpressionAttributeValues: {
      ':goalId': event.pathParameters.goalId,
    },
  };

  dynamoDb.query(params).promise().then((result) => {
    callback(null, response.OK(result.Items));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t fetch the steps.'));
  });
};
