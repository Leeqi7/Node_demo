'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname) //读取文件夹
  .filter(file => { //把model都初始化进来
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;//model的定义
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) { //关系的依赖声明
    db[modelName].associate(db);
  }
});

//把sequelize好实例和Sequelize的包挂到db上去
db.sequelize = sequelize; 
db.Sequelize = Sequelize;

module.exports = db;
