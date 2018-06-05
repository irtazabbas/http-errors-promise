const httpError = require('http-errors');

const COMMON = require('./common');

// Constructor reference
const HttpError = httpError.HttpError;

function error(err, secErr, status = 500, dontReject) {
  if (!error.isMade(err)) {
    if (err) {
      switch(config.logLevel) {
        case(0):
          break;
        case(1):
          console.error(extractError(err));
          break;
        default:
          console.error(err);
      }
    }
    err = error.make(secErr, status);
  }
  if (!dontReject) return Promise.reject(err);
  return err;
}

error.respond = function (res, err, secErr, status = 500) {
  if (!this.isMade(err)) {
    err = this.make(secErr, status);
  }

  res.status(err.status).json(err);
  return this.call(this, err, undefined, status, true);
};

error.make = function(err, status = 500) {
  if (this.isMade(err)) return err;
  else {
    let errObj = httpError(
      status,
      typeof err === 'string' ? err : undefined,
      (err && typeof err.extra === 'object') ? err.extra : {}
    );

    return errObj;
  }
};

error.isMade = function(err) {
  return err instanceof HttpError && typeof err.message === 'string';
};


error.makeCommonErrors = function(modelName) {
  return Object.keys(COMMON).reduce(
    (errors, key) => (errors[key] = COMMON[key](modelName)) && errors,
    {}
  );
};

error.config = function(params) {
  let keys = config.logKeys;
  config = Object.assign(config, params);
  params.keys && (config.logKeys.concat(keys));
};

const extractError = function(error) {
  if (typeof error === 'object') {
    let obj = error;
    return (config.logKeys || []).reduce((prev, cur) => {
      if (
        typeof cur === 'object' &&
        typeof cur.key === 'string' &&
        typeof cur.extractor === 'function' &&
        obj[cur.key]
      ) {
        prev[cur.key] = cur.extractor(obj[cur.key]);
      } else if (obj[cur]) {
        prev[cur] = obj[cur];
      }
      return prev;
    }, {});
  } else {
    return error
  }
};

let config = {
  logLevel: 2,
  logKeys: [
      'name',
      'message',
      'fields',
      { key: 'original', extractor: extractError },
      { key: 'parent', extractor: extractError }
    ]
};


module.exports = error;
