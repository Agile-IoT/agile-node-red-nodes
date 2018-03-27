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
var config = function() {
    var fs = require('fs')
    if(fs.existsSync(__dirname + '/../config.json')) {
        return require('../config.json')
    }
    return require('../config.default.json')
}

module.exports = config()
