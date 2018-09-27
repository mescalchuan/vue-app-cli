const co = require('co')
const ejs = require('ejs');
const fs = require('fs');
const chalk = require('chalk')
const path = require('path');
const ora = require('ora');
const utils = require('../config/utils');

module.exports = (pageName) => {
    co(function*() {
        //读取模板文件
        const entryEJS = fs.readFileSync(path.resolve(__dirname, '../template/entry.ejs'), 'utf-8');
        const htmlEJS = fs.readFileSync(path.resolve(__dirname, '../template/html.ejs'), 'utf-8');
        const componentEJS = fs.readFileSync(path.resolve(__dirname, '../template/component.ejs'), 'utf-8');
        //参数获取新建container名字并转换成驼峰
        const containerName = utils.toHump(pageName);
        const labelName = utils.toLine(containerName);
        //文件路径
        const destinationEntryJS =  `./entry/${containerName}.js`;
        const destinationPageHTML = `./pages/${containerName}.html`;
        const destinationComponent = `./components/${containerName}`;
        const destinationComponentVue = `./components/${containerName}/index.vue`;
        //渲染模板文件
        const entryResult = ejs.render(entryEJS, {pageName: containerName});
        const htmlResult = ejs.render(htmlEJS, {pageName: containerName, labelName});
        const componentResult = ejs.render(componentEJS, {pageName: containerName});

        const entryExist = fs.existsSync(destinationEntryJS);
        const pageExist = fs.existsSync(destinationPageHTML);
        const componentPathExist = fs.existsSync(destinationComponent);
        if(entryExist) {
            console.log(chalk.red(`\n The project has the same container, see your entry/${containerName}.js`));
            process.exit();
        }
        if(pageExist) {
            console.log(chalk.red(`\n The project has the same container, see your pages/${containerName}.html`));
            process.exit();
        }
        if(componentPathExist) {
            console.log(chalk.red(`\n The project has the same container, see your components/${containerName} folder.`));
            process.exit();
        }

        //复制文件
        const spinner = ora(`Creating ${containerName} pages...`).start();
        try {
            fs.mkdirSync(destinationComponent);
            fs.writeFileSync(destinationEntryJS, entryResult);
            fs.writeFileSync(destinationPageHTML, htmlResult);
            fs.writeFileSync(destinationComponentVue, componentResult);
        }
        catch(err) {
            spinner.stop();
            console.log(chalk.red('\n Can not create new page.'));
            console.log(err);
            process.exit();
        }
        spinner.stop();
        console.log(chalk.green('\n Create succeed!'));
        process.exit();
    })
}