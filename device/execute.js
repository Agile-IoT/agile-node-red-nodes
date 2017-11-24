var client = require('../lib/client')
var d = require('debug')('agile-nodes:device:execute')
module.exports = function (RED) {

  var intv = null
  RED.nodes.registerType('agile-device-execute', function (config) {

    RED.nodes.createNode(this, config)
    d('Node was created')
    // this.server = RED.nodes.getNode(config.server)
    //
    // this.name = config.name
    // this.deviceId = config.deviceId
    //
    // var node = this
    // var msg = {}
    //
    // d('API hostname %s:%s', this.server.host, this.server.port)
    // client.get(this.server.host + ':' + this.server.port)
    //   .then(function (client) {
    //
    //     d('Loaded Swagger client')
    //
    //     var exec = function (args) {
    //
    //       d('Sending command..')
    //
    //       var promise
    //       try {
    //         promise = client.Device.Execute({
    //           deviceId: node.deviceId,
    //           command: args.command
    //         })
    //           .then(function (r) {
    //
    //             d('Got response: %j', r)
    //             msg = {
    //               payload: r.data
    //             }
    //
    //             node.send(msg)
    //           })
    //           .catch(function (e) {
    //
    //             d('Failed request %j', e)
    //
    //             var msg = ''
    //             if(e.errObj) {
    //               msg = e.method + ' ' + e.url + ': ' + e.errObj.status + ' ' + e.data
    //             }
    //
    //             node.error('Error executing commnad ' + node.command + ' : ' + msg)
    //           })
    //       } catch(e) {
    //         d('Catch error %j', e)
    //       }
    //       return promise
    //     }
    //
    //     node.on('input', function (msg) {
    //       if(!msg.command) {
    //         node.error('Cannot execute command: msg.command not set')
    //         return
    //       }
    //       node.log('Executing ' + msg.command)
    //       exec(msg)
    //     })
    //
    //
    //   })
    //   .fail(function (e) {
    //     node.error('Error loading Swagger client: ' + e.message)
    //   })

  })

}
