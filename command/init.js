const co = require('co');
const chalk = require('chalk');
const download = require('download-git-repo');
const ora = require('ora');
const exists = require('fs').existsSync;
const rm = require('rimraf').sync;

module.exports = (projectName) => {
    co(function*() {
        console.log(chalk.white('\n Start generating...'));
        const spinner = ora('Start downloading templates...').start();
        if (exists(projectName)) rm(projectName);
        download('1335382915/vue-app-template', projectName, (err) => {
            if(err) {
                console.log(chalk.red(err));
                process.exit();
            }
            spinner.stop();
            console.log(chalk.green('\n Download succeed! Enter your project and use `npm install`'));
            process.exit();
        })
    })
}