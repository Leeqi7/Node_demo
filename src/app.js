const express = require('express');
const bodyParser = require('body-parser');//引入中间件（在使用req.body之前）
const app = express();

//models是一个集合，主要是index.js中
//model的结构是一个数据对象,伪model中有一个Todo，一个sequelize实例还有一个Sequelize静态方法
const models = require('../db/models');
const { sequelize } = require('../db/models');
//使用model的时候要用models下对应的model 见create例子

// {
//     { model: Todo },
//     sequelize,
//     Sequelize    
// }

app.use(express.json());//专门处理express json的

//对url参数做encoded    for parsing application/xwww-form-urlencoded
app.use(express.urlencoded());

//在body上做encoded   for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//1、所有的错误，http status == 500

/** 查询任务列表 */
//用list查有一个弊端，每次都要传status和page否则会出错
//api 根据传递的状态/页码 查询任务列表实现
app.get('/list/:status/:page', async (req, res, next) => {
    //1.状态 1：待办，2：完成，3：删除，-1：全部
    //2. 分页处理
    let { status, page } = req.params;
    let limit = 10; //前端没有做设置分页的功能，这里写死了
    let offset = (page - 1) * limit;  //开始读取数据的脚标
    let where = {};
    if (status != -1) {
        where.status = status;
    }
    let list = await models.Todo.findAndCountAll({  //查询并汇总
        where,
        offset,
        limit
    })
    res.json({
        list,
        message:"列表查询成功"
    })
})

//实现 新增任务  名称/截止日期/内容
/** 创建一个TODO */
app.post('/create', async (req, res, next) => {
    try {
        let { name, deadline, content } = req.body;
        /** 数据持久化到数据库 */
        //models.Todo是一个模型,即ORM对象，.create返回的是一个promise 用await去同步
        let todo = await models.Todo.create({
            name,
            deadline,
            content
            //status 在todo.js中设置默认值为1，刚创建的任务都是待办状态 不用设初始值
        })
        res.json({
            todo,
            message:"任务创建成功"
        })
    } catch (error) {
        next(error) //用next传下去之后就会被全局异常处理捕获到
    }
    
})

//实现 编辑功能 传递的任务对象（根据id修改内容） 编辑名称/截止日期/内容/ID
/** 编辑 修改todo */
app.post('/update', async (req, res, next) => {
    try {
        let { name, deadline, content, id } = req.body;
        // 修改 首先要根据id找到数据库模型 
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        })
        if (todo) {
            // 执行更新功能
            todo = await todo.update({
                name,
                deadline,
                content
            })
        }
        res.json({
            todo
        })
    } catch (error) {
        next(error)
    }
    
})

/** 更新状态，删除 */
app.post('/update_status', async (req, res, next) => {
    try {
        let { id,status } = req.body;
        // 修改 首先要根据id找到数据库模型 
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        })
        if (todo && status != todo.status) {
            // 执行更新
            todo = await todo.update({
                status
            })
        }
        res.json({
            todo
        })
    } catch (error) {
        next(error)
    }
})

//全局异常处理
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message:err.message
        })
    }
})

app.listen(3000, () => {
    console.log('服务启动成功');
})