const Sequelize = require('sequelize');
const database = require('./db');
const crypto = require('crypto');

const saltLength = 64;

function sha256(content) {
    return crypto.createHash('sha256').update(content).digest('hex')
}

function new_salt(length) {
    return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0,length);
};

class SaltedCredentials {
    constructor(email, password){
        this.salt = new_salt(saltLength);
        this.email = sha256(email);
        this.password = sha256(this.salt + password);
    }
}

const UserAuthCredentials = database.sequelize.define('UserAuthCredentials', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: false
    }
});

async function registerCredentials(email, password) {
    const database = require('./db');
    await database.sequelize.sync();

    const credentials = new SaltedCredentials(email, password);

    console.log('new user added:', {
        email: credentials.email,
        password: credentials.password,
        salt: credentials.salt
    });

    UserAuthCredentials.create({
        email: credentials.email,
        password: credentials.password,
        salt: credentials.salt
    });
}

async function simpleSelect(){
    const users = await UserAuthCredentials.findAll();
    console.log(users[0].dataValues);
    return users[0].dataValues;
}

async function autheticateCredentials(email, password) {
    let sucess = false;
    
    const usersInDB = await UserAuthCredentials.findAll({
        where: {
            email: sha256(email)
        }
    });

    let users = usersInDB;

    if(users.length == 1){
        let dbPassword = users[0].dataValues.password;
        let dbSalt = users[0].dataValues.salt;

        if(sha256(dbSalt + password) == dbPassword) {
            sucess = true;
        }
    }

    return sucess;
}

module.exports = {
    UserAuthCredentials,
    registerCredentials,
    autheticateCredentials,
    simpleSelect
}