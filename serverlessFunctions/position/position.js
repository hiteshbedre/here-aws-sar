/*
 * Copyright (c) 2019 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

// https://developer.here.com/documentation/positioning/topics/introduction.html

'use strict';

const https = require("https");

function queryApi(postData, callback) {
    const options = {
        hostname: 'pos.api.here.com',
        port: 443,
        path: `/positioning/v1/locate?app_id=${process.env.HERE_APP_ID}&app_code=${process.env.HERE_APP_CODE}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    console.log(">>>> options\r\n" + JSON.stringify(options));

    const req = https.request(options, res => {
        res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
});
    res.on("end", () => {
        callback(body);
});
});

    req.on('error', (e) => {
        console.error(`>>> error: ${e.message}`);
});
    req.write(postData);
    req.end();
}

exports.positionPOST = (event, context, callback) => {
    console.log(`>>> process.env.HERE_APP_ID: ${process.env.HERE_APP_ID}`);
    console.log(`>>> process.env.HERE_APP_CODE: ${process.env.HERE_APP_CODE}`);

    const postData = event.body;
    console.log(`>>> incoming HTTP POST contents:\r\n${postData}`);

    queryApi(postData, (body) => { callback(null, { body: body }); });
}