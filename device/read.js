var client = require('../lib/client')

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

    client.get(this.server.host, this.server.port)
      .then(function (client) {

        node.log('Loaded Swagger client')

        var loadData = function () {
          node.log('Reading data..')
          return client.Device.Read({
            deviceId: node.deviceId,
            componentId: node.componentId
          }, {
            requestContentType: 'application/json',
            responseContentType: 'text/plain'
          })
            .then(function (r) {
              node.log('Got response: ' + JSON.stringify(r))
              msg = {
                payload: r.data
              }
              node.send(msg)
            })
            .fail(function (e) {
              node.error('Error loading data: ' + e)
            })
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
