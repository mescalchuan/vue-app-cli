# vue-app-cli

目前公司使用`dcloud`开发原生app，已经完成了第一款基于`vue.js`和`require.js`的纯`es5`应用的开发。

由于使用了`require.js`，所有的逻辑都要放在`require.js`的回调函数中，再加上`dcloud`要求对于`plus`的操作都要在`plusReady`事件内才能访问，导致代码中出现大量的函数嵌套，如下：
```
require(["../js/common.js", "../server/homeServer.js"], function(common, homeServer) {
    var vm = new Vue({
        el: "#app",
        data: {
            isLoading: true
        },
        mounted: function() {
            var self = this;
            //在plusReady后才能访问plus对象
            mui.plusReady(function() {
                //打开原生的loading框
                var w = plus.showWaiting();
                homeServer.initData(function() {
                    self.isLoading = false;
                    //请求成功后，关闭loading框
                    w.close();
                });
            })
        }
    })
})
```

过多的函数嵌套不仅影响美观，也降低了开发效率，并且在`es5`中需要时刻注意`this`的绑定目标。

为了解决以上问题，我对不久前开发的[angular-m-cli](https://github.com/1335382915/angular-m-cli.git)进行了修改，使其变为可以快速开发基于vue的app多页应用脚手架——[vue-app-cli](https://github.com/1335382915/vue-app-cli.git)。

#### vue-cli
之所以不使用官方的`vue-cli`构建应用是因为：
* `vue-cli`需要自己实现多页面构建。
* 在开发环境（`npm start`）下会创建服务器，一切构建结果都存放在内存中，本地无法访问，导致`app`变为空白页。
* 只有在生产环境（`npm run build`）下才会构建到本地，却失去了对模块的实时监控。
* `webpack`拆分太细，功能太全，很多功能在`app`端都不会用到。

以上不足均可以自行修改`vue-cli`实现构建最优化，出于时间成本的考虑，最终决定在已有的`angular-m-cli`的基础上完成适合`app`开发的脚手架构建。

#### vue-app-cli
可以快速构建基于vue的app多页应用，对`h5页面app`和`dcloud原生app`都十分友好。

它实现了以下功能：
* 快速生成`app`模板
* 快速创建新页面
* 支持`es6`
* 支持`.vue`文件
* 基于`sass`编写样式文件
* 模块导入样式文件
* 错误映射

### 如何使用
 #### 一、起步
*由于工程使用到了`sass`，请确保您的电脑已经安装了`python`

方法一：你需要将该项目克隆到本地，安装相关依赖
```
git clone https://github.com/1335382915/vue-app-cli.git
//进入到vue-app-cli目录下
npm i
```

除此之外，你还需要将该工程链接到全局执行环境中，方便全局使用
```
npm link
```

方法二：`npm i vue-app-cli -g`

现在，我们随便进入一个文件夹，输入`vue-app`命令，看看是否可以全局使用了

![](https://upload-images.jianshu.io/upload_images/1495096-29a6e471537ccb32.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


* -v | --version：查看vue-app-cli版本
* -h | --help：查看帮助
* init | i  <projectName>：创建一个新的项目
* add | a  <pageName>：添加新的页面
* list | l ：列举出所有页面
* delete | d <pageName>：删除指定页面

#### 二、使用
注：所有的命令均必须在项目的根目录中输入，在本例子中是`vueApp`
##### 1. 创建工程

在命令行中输入`vue-app init vueApp`，等待片刻

![](https://upload-images.jianshu.io/upload_images/1495096-76414d4eddee68ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


进入到`vueApp`文件夹下，安装依赖`cd vueApp && npm i`，之后使用`npm start`启动项目，双击`pages/home.html`

![vue-app-cli](https://upload-images.jianshu.io/upload_images/1495096-a98647dfbb9fff11.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


下面我们来看一下目录结构

![](https://upload-images.jianshu.io/upload_images/1495096-16283bf9c5cd55cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* `build`存放构建好的js和css
* `components`存放每个页面的根组件，你可以在每个文件夹内部扩展其他组件
* `css`存放页面样式，建议将通用样式和框架样式放入其中，页面自己的样式写入到`.vue`中
* `entry`存放每个页面的入口js文件，例如：home页的入口文件为`entry/home.js`
* `images`存放图片
* `js`存放页面逻辑，建议将通用逻辑和框架js放入其中，页面自己的逻辑写入到`.vue`中
* `pages`存放页面

##### 2. 添加新页面
在命令行中输入`vue-app add user`，之后再一次运行`npm start`，启动项目，将url中的`home`改为`user`

![](https://upload-images.jianshu.io/upload_images/1495096-bb1ccea0ce3739f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/1495096-9ef97e7398b24d03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


看似简单的操作，但实质上user的相关文件和配置已经自动生成
```
├── components
│   ├── home
│   │   └── index.vue
│   └── user
│       └── index.vue
├── entry
│   ├── home.js
│   └── user.js
├── pages
│   ├── home.html
│   └── user.html
```

##### 3. 本地开发
不同于`angular-m-cli`，`vue-app-cli`不区分开发环境和生产环境，它所做的功能仅仅监听模块的变更并通过一系列转换，将构建结果输出到`build`文件夹里。

你所做的工作仅仅是打开页面 --> 更改代码 --> 刷新页面查看更改。

##### 4. 发布
即便`vue-app-cli`不区分环境，但当你准备部署到服务器或者打包成app时，仍然需要额外做一些操作：
* 可能你注意到`build`文件夹下有很多`.map`结尾的文件，这些文件的存在使得我们在调试错误时仍然可以将错误定位到原始文件中。这些文件占据了一定的存储空间，一般在线上不会用到。你需要做的就是将`build`文件夹删除，然后将`config.js`中的`isDevelopment`设置为false，然后重新启动项目即可。
* 较大的图片会生成到`build/images`下，在发布时请将该图片文件夹删除。

##### 5. 其他指令
* 列举页面：`vue-app list`
* 删除页面及其配置项：`vue-app delete <pageName>`

##### 6. 自定义配置（webpack.config.js）
配置项位于`config.js`中，目前仅支持配置环境和通用代码块：
```
module.exports = {
	isDevelopment: true,
	commonModule: ["./js/common.js"]
}
```

##### 7.开发原生app
`vue-app-cli`可以很容易地集成到`dcloud`中，只需要以下几步：
1. 在`hbuilder`中创建`移动app`项目，建议选择`mui项目`模板，我们为该项目命名为`vueApp2`
![](https://upload-images.jianshu.io/upload_images/1495096-4d884b66a656140b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 将`vueApp`的所有文件复制到`vueApp2`中
3. 将`node_modules`文件夹移动到`vueApp2`的外层目录中，否则`node_modules`也会作为项目的一部分，极大降低app打包速度

最终的目录结构：
![](https://upload-images.jianshu.io/upload_images/1495096-42b9e615cae1d79e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/1495096-fb437cf5420832b0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 结尾 
访问[github](https://github.com/1335382915/vue-app-cli)查看源码

参考：[angular-m-cli](https://github.com/1335382915/angular-m-cli)


