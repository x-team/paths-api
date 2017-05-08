'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.name !== 'string' || typeof data.description !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the step item.'));
    return;
  }

  const params = {
    TableName: process.env.STEPS_TABLE,
    Item: {
      id: uuid.v1(),
      goalId: event.pathParameters.goalId,
      name: data.name,
      description: data.description,
      icon: data.icon,
      achieved: false,
      achievedDate: data.achievedDate,
      lastNotificationSent: data.lastNotificationSent,
      level: data.level,
      dueDate: data.dueDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the step item.'));
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(params.Item),
    };

    callback(null, response);
  });
};
