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

  var specPath = __dirname + '/../' + config.spec
  d('Loading spec from %s', specPath)

  return new Swagger({
    spec: require('yamljs').load(specPath),
    usePromise: true
  })
    .then(function (client) {

      d('Loading, setting host to %s', host)
      client.setHost(host)

      clients[host] = client
      defer.resolve(client)

      return defer.promise
    })
    .catch(function(e) {
      d('Failed to load Swagger spec: ' + e.message)
    })
}
