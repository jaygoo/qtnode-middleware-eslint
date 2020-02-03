'use strict';

const priter= require('qtnode-middleware-console');
const childProcess = require('./utils/childProcess');
const path = require('path');

module.exports = function (args) {
    Object.assign({}, args);


    return async function (next) {
        priter.info('正在进行静态代码规范检测>>>>>>>>>>>>>');

        let cmd = 'eslint --color  --fix --ext .jsx,.js,ts,tsx ';
        cmd += ` ${ path.resolve(process.cwd(), 'entry/')}`;
        cmd += ` ${ path.resolve(process.cwd(), 'src/')} ${ path.resolve(process.cwd(), 'wpconf/')}`;
        cmd += ` --rulesdir  ${path.resolve(__dirname, '../')}`;

        await childProcess.execPromise(cmd, {encoding: 'utf8', cwd: process.cwd()})

            .then((data) => {
                priter.data(data);
                let arrErr = data.match(/problems \((.*?) errors/);
                let arrWaring = data.match(/errors, (.*?) warnings/);
                if(arrErr != null && arrErr != null)
                    priter.warn('扫描出 错误:' + arrErr[1] + ' warings:' + arrWaring[1]);
                priter.tip('eslint静态代码规范检测通过 ');

            })
            .catch((data) => {
                priter.data(data);


                let arrErr = data.match(/problems \((.*?) errors/);
                let arrWaring = data.match(/errors, (.*?) warnings/);
                if(arrErr != null && arrErr != null)
                    priter.error('扫描出 错误:' + arrErr[1] + ' warings:' + arrWaring[1]);
                priter.tip('静态代码规范检测未通过');
                process.exit(1);

            });

        next();
    };
};


