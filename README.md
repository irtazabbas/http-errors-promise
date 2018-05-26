# http-errors-promise
Server side error handling service, best suited for promise chains, uses `http-errors`.

## Basic Usage
```(javascript)
  const error = require('http-errors-promise');
  
  router.get('/', function(req, res, next) {
    getStuffFromDB()
      .then(//...)
      .catch(function (error) {
        return error.respond(
          res,
          error, // error from the call 'getStuffFromDB'
          'Something went wrong' // error from this context
        );
      });
  });
```
## Shining Use-case
```(javascript)
function doSomething() {
  // returns a promise
  return new Promise((resolve, reject) => {
    // doing some stuff...
    if (someCondition) {
      resolve(result);
    } else {
      return error(null, 'messed up while doing something', 500);
    }
  })
}

function doSomethingElse() {
  // calls 'doSomething', does its own processing and returns a promise
  return doSomething()
    .then(result => {
      // does some stuff
      return newResult;
    })
    .catch(err => error(
      err,
      'Messed up while doing somethingElse'
    ));
}

function mainFunction() {
  doSomethingElse()
    .catch(err => {
      // here 'err' could either be from 'doSomething' or 'doSomethingElse' based on what got wrong and where the error actually origined from, more technically the error properly bubbles up
    })
}
```

## Methods
### *error(err, secErr, status = 500, dontReject)*
- `err` error object recieved from a function call
- `secErr` error from the current context
- `status` http status, defaults to *500*
- returns a rejected promise with the resulting error
- `dontReject` returns the resulting error instead of a rejected promise


### *error.respond(res, err, secErr, status = 500)*
- similar to `error` method, except that it takes the *express'* response object
and sends the response with the error instead of returning

### *error.make(err, status = 500)*
- creates and returns an error using `http-errors`

### *makeCommonErrors(modelName)*
- creates and returns commonly seen errors by using a dynamically set `modelName` in the error message, also using `http-errors`

<br><br>
Design inspired by [ralusek's](https://github.com/ralusek) work on error handling
