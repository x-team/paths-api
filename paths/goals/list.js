'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const response = require('../utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.GOALS_TABLE,
    KeyConditionExpression: 'pathId = :pathId',
    ExpressionAttributeValues: {
      ':pathId': event.pathParameters.pathId,
    },
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.BadRequest('Couldn\'t fetch the goals.'));
      return;
    }

    callback(null, response.OK(result.Items));
  });
};
