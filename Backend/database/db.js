const Sequelize = require('sequelize')

const sequelize = new Sequelize('gagainsano', 'root', '#gominho123', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = {sequelize}