'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.GOALS_TABLE,
    KeyConditionExpression: 'pathId = :pathId',
    ExpressionAttributeValues: {
      ':pathId': event.pathParameters.id,
    },
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the goals.'));
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
