/*******************************************************************************
 *Copyright (C) 2017 FBK, ATOS.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    FBK, ATOS - initial API and implementation
 ******************************************************************************/
var client = require('../lib/client')
var d = require('debug')('agile-nodes:device:Write')
module.exports = function (RED) {

  var intv = null
  RED.nodes.registerType('agile-device-write', function (config) {

    RED.nodes.createNode(this, config)

    this.server = RED.nodes.getNode(config.server)

    this.name = config.name
    this.deviceId = config.deviceId
    this.componentId = config.componentId
    this.msgToWrite = {}

    var node = this
    var msg = {}
    var device = null;

    node.on('input', function(msg) { 
      msgToWrite = msg.payload;
      node.log('Received Message: ' + JSON.stringify(msgToWrite))
      if(this.device == null) {
        getDevice();
      }
      sentData();
    });

    var getDevice = function() {
      d('API hostname %s:%s', node.server.host, node.server.port)
      client.get(node.server.host + ':' + node.server.port)
        .then(function (client) {

          d('Loaded Swagger client')
          node.device = client.Device;

        })
        .fail(function (e) {
          node.error('Error loading Swagger client: ' + e.message)
        })
    }
    var sentData = function () {
      d('Sending payload..')
      var promise;
        try {

          promise = node.device.Write({
            deviceId: node.deviceId,
            componentId: node.componentId,
            payload: msgToWrite
          })
            .then(function (r) {

              d('Got response: %j', r)
            })
            .catch(function (e) {

              d('Failed request %j', e)

              var msg = ''
              if(e.errObj) {
                msg = e.method + ' ' + e.url + ': ' + e.errObj.status + ' ' + e.data
              }

              node.error('Error writing payload ' + JSON.stringify(msgToWrite) + ' : ' + msg + ' e: ' + JSON.stringify(e))
            })
        } catch(e) {
          d('Catch error %j', e)
        }
        return promise
    }

  })

}
