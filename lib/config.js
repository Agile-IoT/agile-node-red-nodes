var config = function() {
    var fs = require('fs')
    if(fs.existsSync(__dirname + '/../config.json')) {
        return require('../config.json')
    }
    return require('../config.default.json')
}

module.exports = config()
