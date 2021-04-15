# 需求说明 API 说明

1. 根据客户端传递过来的不同的参数（状态/页码） 查询 任务的列表
2. 实现 新增的一个任务功能 （名称/截止日期/内容）
3. 实现 一个编辑的功能：根据客户端传递的任务对象（已存在的数据）进行编辑，（名称/截止日期/内容/ID）
4. 删除一个任务 （ID）
5. 修改任务的状态（ID/状态--待办/完成）

# API 实现

在使用 req.body 之前先引入中间件

## 数据库初始化

1. 创建一个数据库 navicat 中创建数据库 字符集 utf8mb4 排序规则 utf8mb4_croatian_ci
2. 使用 `sequelize-cli` 初始化 项目的数据库配置信息
   然后创建一个文件夹 mkdir db 先 cd db 到这个文件夹中去 再使用命令去生成 `npx sequelize init`
   修改 config.json 文件 配置数据库信息 密码要加上双引号 "timezone":"+08:00" //设置时区 +08:00 北京时间

3. 生成模型文件 都是在 db 文件夹中执行的命令
   1. migrate 文件
   2. model 文件
      `npx sequelize model:generate --name Todo --attributes name:string,deadline:date,content:string `
      创建成功之后稍微修改一下 migrations 中的 js 文件属性 删除默认的 createAt 和 updateAt 属性
4. 持久化模型对应的[数据库表]
   `npx sequelize db:migrate` 检查数据库中 todo 表就生成了

## API 中具体使用 ORM 模型

1. 在 app.js 中导入模型
