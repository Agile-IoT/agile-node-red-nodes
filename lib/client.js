var Swagger = require('swagger-client')

var config = require('./config')


var __client = null
module.exports.get = function (baseHost, basePort) {

  var defer = require('q').defer()

  if(__client) {
    defer.resolve(__client)
    return defer.promise
  }

  return new Swagger({
    url: config.specUrl,
    usePromise: true
  })
    .then(function (client) {
      client.setHost(baseHost + (basePort ? basePort : ''))
      __client = client
      defer.resolve(__client)
      return defer.promise
    })
    .fail(function(e) {
      console.error('Failed to load Swagger spec', e)
    })
}
