
/* global console */

var Swagger = require('swagger-client')
var config = require('./config')
var d = require('debug')('agile-nodes:client')

var clients = {}

module.exports.get = function (host) {

  var defer = require('q').defer()

  if(clients[host]) {
    defer.resolve(clients[host])
    d('Using cached client')
    return defer.promise
  }

  d('Loading spec from %s', config.specUrl)

  return new Swagger({
    url: config.specUrl,
    usePromise: true
  })
    .then(function (client) {

      d('Loading, setting host to %s', host)
      client.setHost(host)

      clients[host] = client
      defer.resolve(client)

      return defer.promise
    })
    .fail(function(e) {
      d('Failed to load Swagger spec: ' + e.message)
    })
}
