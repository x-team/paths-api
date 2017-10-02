'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const response = require('./utils/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.userId !== 'string') {
    console.error('Validation Failed');
    callback(null, response.BadRequest('Couldn\'t create the path item.'));
    return;
  }

  const params = {
    TableName: process.env.PATHS_TABLE,
    Item: {
      id: uuid.v1(),
      userId: data.userId,
      name: data.name,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.BadRequest('Couldn\'t create the path item.'));
      return;
    }

    callback(null, response.OK(params.Item));
  });
};
