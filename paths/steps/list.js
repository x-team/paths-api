'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

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
      callback(new Error('Couldn\'t fetch the steps.'));
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(result.Items),
    };

    callback(null, response);
  });
};
