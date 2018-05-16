# http-errors-promise
Server side error handling service, best suited for promise chains, uses `http-errors`.

## Usage
```(javascript)
  const error = require('http-errors-promise');
  
  router.get('/', function(req, res, next) {
    getStuffFromDB()
      .then(//...)
      .catch(function (error) {
        error.respond(
          res,
          error, // error from the call
          'Something went wrong' // error from this context
        );
      });
  });
```

## Methods
### error(err, secErr, status = 500, dontReject)

### error.respond(res, err, secErr, status = 500)

### error.make(err, status = 500)
