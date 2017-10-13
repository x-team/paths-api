'use strict';

const AWS = require('aws-sdk');
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
      '#goal_level': 'level',
      '#goal_status': 'status',
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':description': data.description,
      ':icon': data.icon,
      ':level': data.level,
      ':achieved': data.achieved,
      ':achievedDate': achievedDate,
      ':dueDate': data.dueDate,
      ':status': data.status,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #goal_name = :name, description = :description, icon = :icon, #goal_level = :level, achieved = :achieved, achievedDate = :achievedDate, dueDate = :dueDate, updatedAt = :updatedAt, #goal_status = :status',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params).promise().then((result) => {
    callback(null, response.OK(result.Attributes));
  }).catch((error) => {
    console.error(error);
    callback(null, response.BadRequest('Couldn\'t update the goal item.'));
  });
};
