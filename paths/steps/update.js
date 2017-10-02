'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const response = require('../utils/response');

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
      ':status': data.status,
      ':achieved': data.achieved,
      ':achievedDate': achievedDate,
      ':lastNotificationSent': data.lastNotificationSent,
      ':dueDate': data.dueDate,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #step_name = :name, description = :description, icon = :icon, #step_level = :level, achieved = :achieved, achievedDate = :achievedDate, dueDate = :dueDate, updatedAt = :updatedAt, lastNotificationSent = :lastNotificationSent, status = :status',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.BadRequest('Couldn\'t update the step item.'));
      return;
    }

    callback(null, response.OK(result.Attributes));
  });
};
