const createCorsResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true
  },
  body: JSON.stringify(body),
});

const OK = (body) => createCorsResponse(200, body);
const BadRequest = (body) => createCorsResponse(400, body);

module.exports = {
  OK,
  BadRequest,
  createCorsResponse,
};
