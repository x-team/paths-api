'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const response = require('../utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.name !== 'string' || typeof data.description !== 'string') {
    console.error('Validation Failed');
    callback(null, response.BadRequest('Couldn\'t create the goal item.'));
    return;
  }

  const params = {
    TableName: process.env.GOALS_TABLE,
    Item: {
      id: uuid.v1(),
      pathId: event.pathParameters.pathId,
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
      callback(null, response.BadRequest('Couldn\'t create the goal item.'));
      return;
    }

    callback(null, response.OK(params.Item));
  });
};
