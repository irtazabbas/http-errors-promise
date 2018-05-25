const hE = require('http-errors');

module.exports = Object.freeze({
  // BAD REQUESTS
  INVALID_PARAMS: m => hE(400, `Invalid params for '${m}'.`),

  // NOT FOUNDS
  NOT_FOUND: m => hE(404, `'${m}' not found.`),

  // SERVER SIDE ERRORS
  FIND_ERRED: m => hE(500, `Error finding '${m}'.`),
  CREATE_ERRED: m => hE(500, `Error creating '${m}'.`),
  UPDATE_ERRED: m => hE(500, `Error updating '${m}'.`),
});
