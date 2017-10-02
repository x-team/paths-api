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
    TableName: process.env.GOALS_TABLE,
    Key: {
      pathId: event.pathParameters.pathId,
      id: event.pathParameters.goalId
    },
    ExpressionAttributeNames: {
      '#goal_name': 'name',
      '#goal_level': 'level'
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':description': data.description,
      ':icon': data.icon,
      ':level': data.level,
      ':lastNotificationSent': data.lastNotificationSent
      ':achieved': data.achieved,
      ':achievedDate': achievedDate,
      ':dueDate': data.dueDate,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #goal_name = :name, description = :description, icon = :icon, #goal_level = :level, achieved = :achieved, achievedDate = :achievedDate, dueDate = :dueDate, updatedAt = :updatedAt, lastNotificationSent = :lastNotificationSent',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.BadRequest('Couldn\'t update the goal item.'));
      return;
    }

    callback(null, response.OK(result.Attributes));
  });
};
