module.exports = function (RED) {
    RED.nodes.registerType('agile-config-server', function (config) {
        RED.nodes.createNode(this, config)
        this.host = config.host
        this.port = config.port
    })
}
