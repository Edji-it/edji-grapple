const Sentry = require('@sentry/node')

module.exports = function (err, req, res, next) {
  Sentry.captureException(err)
  next(err)
}