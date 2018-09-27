const exec = require('child_process').exec;
const co = require('co');
const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
    co(function* () {
        fs.readdir('./pages', (err, data) => {
	    if(err) {
	        console.log(chalk.red('\n Can not find pages, please make sure that you are in the root of the project'))
		process.exit();
	    }
	    console.log(data);
	    process.exit();
	})
    })
}