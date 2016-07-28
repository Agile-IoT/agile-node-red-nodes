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

  var intv = null;
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

        var loadData = function() {
          // Show the devices list
          // client.DeviceManager.Devices().then(console.log.bind(console.log))
          client.Device.Read({
            deviceId: node.deviceId,
            componentId: node.componentId
          }, {
            requestContentType: 'application/json',
            responseContentType: 'text/plain'
          })
          .then(function(r) {
            node.log("Got response " + JSON.stringify(r));
            msg = {
              payload: r.data
            };
            node.send(msg);
          })
          .fail(function(e) {
            // console.warn(arguments);
            node.error(e.obj, "read error");
          })
          ;
        };

        if(intv) {
          clearInterval(intv);
          intv = null;
        }

        if(node.interval > 0) {
          intv = setInterval(loadData, node.interval*1000);
          loadData();
        }
        loadData();

      })
      .fail(function (e) {
        node.error(e.obj, "read loading client");
      });

  }
  RED.nodes.registerType("agile-device-read", AgileDeviceReadNode);

};
