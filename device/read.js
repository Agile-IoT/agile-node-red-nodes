var client = require('../lib/client')
var d = require('debug')('agile-nodes:device:read')
module.exports = function (RED) {

  var intv = null
  RED.nodes.registerType('agile-device-read', function (config) {

    RED.nodes.createNode(this, config)

    this.server = RED.nodes.getNode(config.server)

    this.name = config.name
    this.interval = config.interval
    this.deviceId = config.deviceId
    this.componentId = config.componentId

    var node = this
    var msg = {}

    d('API hostname %s:%s', this.server.host, this.server.port)
    client.get(this.server.host + ':' + this.server.port)
      .then(function (client) {

        d('Loaded Swagger client')

        var loadData = function () {

          d('Reading data..')

          var promise
          try {
            promise = client.Device.Read({
              deviceId: node.deviceId,
              componentId: node.componentId
            })
              .then(function (r) {

                d('Got response: %j', r)

                msg = {
                  payload: r.data
                }

                node.send(msg)
              })
              .catch(function (e) {

                d('Failed request %j', e)

                var msg = null
                if(e.errObj) {
                  msg = e.method + ' ' + e.url + ': ' + e.errObj.status + ' ' + e.data
                }

                node.error('Error loading data: ' + msg)
              })
          } catch(e) {
            d('Catch error %j', e)
          }
          return promise
        }

        if(intv) {
          clearInterval(intv)
          intv = null
        }

        if(node.interval > 0) {
          intv = setInterval(loadData, node.interval * 1000)
          loadData()
        }

        loadData()

      })
      .fail(function (e) {
        node.error('Error loading Swagger client: ' + e.message)
      })

  })

}
