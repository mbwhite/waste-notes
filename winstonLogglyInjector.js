/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const fs = require('fs-extra');
const winston = require('winston');
const sprintf = require('sprintf-js').sprintf;

require('winston-loggly-bulk');

/** The json structure that has been specified in the configuration
 * @private
 * @param {Object} config JSON structure with specific configuration information
 * @param {Array} configElements array with the  DEBUG env variables for composer
 *
 * @returns {Object} object that is the logger to use
  */
exports.getLogger = function (config,configElements){

    let consoleLevel;
    let logglyLevel;

    if (configElements.debug.length === 0){
        consoleLevel='error';
        logglyLevel='info';
    } else {
        logglyLevel=config.loggly.enabledLevel;
        consoleLevel=config.console.enabledLevel;
    }

    let formatterFn = function(options) {
       // Return string will be passed to logger.
        return sprintf('%s %-7s %-20s %s'
       ,options.timestamp()
       ,options.level.toUpperCase()
       ,options.message
       ,(JSON.stringify(options.meta,null,'') +'$')
      );

    };

    let timestampFn = function() {
        return new Date(Date.now()).toISOString();
    };


    let newWinstonLogger =  {
        transports: [
            new(winston.transports.Console)({
                name: 'info-file',
                timestamp: timestampFn,
                formatter: formatterFn ,
                level: consoleLevel
            }),
            new(winston.transports.Loggly)( {
                name:'loggly',

                timestamp: timestampFn,
                formatter: formatterFn ,
                level: logglyLevel,
                token: 'a09d897e-1f68-4caa-96cf-e49ebd4ecef1',
                subdomain: 'calanais',
                tags: ['Winston-NodeJS'],
                json:true
            })

        ]
    };

    winston.loggers.add('Fabric-Composer',newWinstonLogger);
    return winston.loggers.get('Fabric-Composer');


};
