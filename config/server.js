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
module.exports = function (RED) {
    RED.nodes.registerType('agile-config-server', function (config) {
        RED.nodes.createNode(this, config)
        this.host = config.host
        this.port = config.port
    })
}
