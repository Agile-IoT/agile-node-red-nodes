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
module.exports = function (RED) {
    RED.nodes.registerType('agile-config-server', function (config) {
        RED.nodes.createNode(this, config)
        this.host = config.host
        this.port = config.port
    })
}
