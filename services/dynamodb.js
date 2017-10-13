const AWS = require('aws-sdk');

const DynamoService = (options) => {
  if (!options) {
    options = {};
  }

  return new AWS.DynamoDB.DocumentClient({
    region: process.env.LOCAL === "1" ? 'localhost' : (
      options.region || 'us-east-1'
    ),
    endpoint: process.env.LOCAL === "1" ? 'http://localhost:8000' : undefined,
  });
}

module.exports = DynamoService;

