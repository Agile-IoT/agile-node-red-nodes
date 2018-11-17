/*******************************************************************************
 *Copyright (C) 2017 FBK, ATOS.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    FBK, ATOS - initial API and implementation
 ******************************************************************************/
var WebSocket = require('ws')
var d = require('debug')('agile-nodes:device:start')

module.exports = function (RED) {
    RED.nodes.registerType('agile-device-start', function (config) {
        RED.nodes.createNode(this, config);

        var node = this;

        if (config.name) {
            node.name = config.name;
        }
        if (config.deviceId) {
            node.deviceId = config.deviceId;
        }
        if (config.componentId) {
            node.componentId = config.componentId;
        }
        if (config.server) {
            node.server = RED.nodes.getNode(config.server);
        }

        this.on('input', function(msg) {
            if (msg.payload) {
                if (msg.payload.name) {
                    node.name = msg.payload.name;
                }
                if (msg.payload.deviceId) {
                    node.deviceId = msg.payload.deviceId;
                }
                if (msg.payload.componentId) {
                    node.componentId = msg.payload.componentId;
                }
                if (msg.payload.server) {
                    node.server = RED.nodes.getNode(msg.payload.server);
                }
            }

            if (node.server && node.deviceId && node.componentId) {
                var flowContext = node.context().flow;
                var sockets = flowContext.get('sockets');
                var identifier = node.deviceId + ':' + node.componentId;

                if (sockets) {
                    if (sockets[identifier]) {
                        node.send({ payload: 'The device is already on' });
                        return;
                    }
                } else {
                    sockets = {};
                }

                var ws_url = 'ws://' + node.server.host +
                  (node.server.port ? ':' + node.server.port : '') +
                  '/ws/device/' +
                  node.deviceId +
                  '/' + node.componentId +
                  '/subscribe';

                var ws = new WebSocket(ws_url);
                d('Connection to WS url %s', ws_url);

                ws.on('open', function () {
                    node.log('WebSocket connected to: ' +  ws_url);
                    d('Connected to ' + ws_url);
                })

                ws.on('close', function () {
                    node.log('WebSocket closed to: ' +  ws_url);
                    d('Connection closed to ' + ws_url)
                })

                ws.on('error', function (e) {
                    node.error('WebSocket error: ' + JSON.stringify(e));
                    d('WS Connection error %j', e);
                })

                ws.on('message', function(data) {
                    d('Data received %s', data);

                    node.log("WebSocket data: " + data);

                    try {
                        payload = JSON.parse(data);
                    } catch(e) {
                        node.error("Can't parse WebSocket data");
                    }

                    node.send({ payload: payload });
                })

                sockets[identifier] = ws
                flowContext.set('sockets', sockets);
            } else {
                node.send({ payload: 'There are missing configuration parameters' });
                return;
            }
            node.send({ payload: 'The device was started successfully' });
        })

        node.on('close', function() {
            var flowContext = node.context().flow;
            var sockets = flowContext.get('sockets');
            for (var socket in sockets) {
                node.context().flow;
            }
            flowContext.set('sockets', {});
        });
    })
}