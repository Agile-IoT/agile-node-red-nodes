var WebSocket = require('ws')
var d = require('debug')('agile-nodes:device:subscribe')

module.exports = function (RED) {

  RED.nodes.registerType('agile-device-subscribe', function (config) {

    RED.nodes.createNode(this, config)

    // Retrieve the config node
    this.server = RED.nodes.getNode(config.server)

    this.name = config.name
    this.deviceId = config.deviceId
    this.componentId = config.componentId

    var node = this

    var ws_url = 'ws://' + this.server.host +
      (this.server.port ? ':' + this.server.port : '') +
      '/ws/device/' +
      this.deviceId +
      '/' + this.componentId +
      '/subscribe'

    var ws = new WebSocket(ws_url)
    d('Connection to WS url %s', ws_url)

    ws.on('open', function () {
      d('Connected to ' + ws_url)
    })

    ws.on('close', function () {
      d('Connection closed to ' + ws_url)
    })

    ws.on('error', function (e) {
      d('WS Connection error %j', e)
    })

    ws.on('message', function (data) {

      // d('Data received %s', data)

      var payload = data
      try {
        payload = JSON.parse(data)
      } catch(e) {
        // failed to parse
      }

      node.send({
        payload: payload
      })
    })

  })
}
