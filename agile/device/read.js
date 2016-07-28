var BASE_HOST = "agile-iot.ddns.net:8080";
// var API_SPEC = 'http://agile-iot.github.io/agile-api-spec/docs/swagger/api.swagger.yml';
var API_SPEC = 'http://localhost:3000/swagger.tmp.yml';

module.exports = function (RED) {
  "use strict";

  var Swagger = require('swagger-client');

  var __client = null;
  var getClient = function () {
    var defer = require('q').defer();
    if(__client) {
      defer.resolve(__client);
      return defer.promise;
    }
    return new Swagger({
        url: API_SPEC,
        usePromise: true
      })
      .then(function (client) {
        // console.warn(client);
        __client = client;
        defer.resolve(__client);
        return defer.promise;
      });
  };

  function AgileDeviceReadNode(n) {

    RED.nodes.createNode(this, n);

    this.name = n.name;
    this.interval = n.interval;
    this.deviceId = n.deviceId;
    this.componentId = n.componentId;

    var node = this;
    var msg = {};

    getClient()
      .then(function (client) {

        // Show the devices list
        // client.DeviceManager.Devices().then(console.log.bind(console.log))

        client.Device.Read({
          deviceId: node.deviceId,
          componentId: node.componentId
        })
        .then(function(r) {
          node.log("Got response " + JSON.stringify(r.obj));
          msg = {
            payload: r.obj
          };
          node.send(msg);
        })
        .fail(function(e) {
          // console.warn('err', e);
          node.error(e.obj, "read error");
        })
        ;

      })
      .fail(function (e) {
        node.error(e.obj, "read loading client");
      });

  }
  RED.nodes.registerType("agile-device-read", AgileDeviceReadNode);

};
