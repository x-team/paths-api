const AWS = require('aws-sdk');

const DynamoService = (options) => {
  if (!options) {
    options = {};
  }

  // If ran locally, override AWS Credentials to fake ones
  if (process.env.LOCAL === "1") {
    AWS.config.update({
      accessKeyId: 'offline',
      secretAccessKey: 'offline'
    });
  }

  return new AWS.DynamoDB.DocumentClient({
    region: process.env.LOCAL === "1" ? 'localhost' : (
      options.region || 'us-east-1'
    ),
    endpoint: process.env.LOCAL === "1" ? 'http://localhost:8000' : undefined,
  });
}

module.exports = DynamoService;

