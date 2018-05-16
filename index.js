const Promise = require('bluebird');
const httpError = require('http-errors');

// Constructor reference
const HttpError = httpError.HttpError;


function error(err, secErr, status = 500, dontReject) {
  if (!error.isMade(err)) {
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


module.exports = error;
