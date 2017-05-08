'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  let achievedDate = null;
  if (data.achieved) {
    achievedDate = timestamp;
  }

  const params = {
    TableName: process.env.STEPS_TABLE,
    Key: {
      goalId: event.pathParameters.goalId,
      id: event.pathParameters.stepId
    },
    ExpressionAttributeNames: {
      '#step_name': 'name',
      '#step_level': 'level'
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':description': data.description,
      ':icon': data.icon,
      ':level': data.level,
      ':achieved': data.achieved,
      ':achievedDate': achievedDate,
      ':lastNotificationSent': data.lastNotificationSent,
      ':dueDate': data.dueDate,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #step_name = :name, description = :description, icon = :icon, #step_level = :level, achieved = :achieved, achievedDate = :achievedDate, dueDate = :dueDate, updatedAt = :updatedAt, lastNotificationSent = :lastNotificationSent',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the step item.'));
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(result.Attributes),
    };

    callback(null, response);
  });
};
