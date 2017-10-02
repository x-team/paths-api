'use strict';

const AWS = require('aws-sdk');
const response = require('../utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.STEPS_TABLE,
    KeyConditionExpression: 'goalId = :goalId',
    ExpressionAttributeValues: {
      ':goalId': event.pathParameters.goalId,
    },
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.BadRequest('Couldn\'t fetch the steps.'));
      return;
    }

    callback(null, response.OK(result.Items));
  });
};
