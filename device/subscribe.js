var WebSocket = require('ws')

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
      'ws/device/' +
      this.deviceId +
      '/' + this.componentId +
      '/subscribe'

        var ws = new WebSocket(ws_url)

        ws.on('open', function open() {
            node.log('Connected to ' + ws_url)
        })

        ws.on('close', function open() {
            node.warn('Connection closed to ' + ws_url)
        })

        ws.on('message', function (data) {
            node.log('Received ' + data)

            var payload = data
            try {
                payload = JSON.parse(data)
            }
            catch(e) {
              // failed to parse
            }

            node.send({
                payload: payload
            })
        })

    })
}
