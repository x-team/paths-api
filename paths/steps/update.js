'use strict';

const response = require('../utils/response');
const dynamoDb = require('../../services/dynamodb')();

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

  dynamoDb.update(params).promise().then((result) => {
    callback(null, response.OK(result.Attributes));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t update the step item.'));
  });
};
