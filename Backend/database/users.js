const Sequelize = require('sequelize');
const database = require('./db');
const crypto = require('crypto');

const saltLength = 64;

function sha256(content){
    return crypto.createHash('sha256').update(content).digest('hex')
}

function new_salt(length){
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

async function registerUser(email, password){
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

module.exports = {
    UserAuthCredentials,
    registerUser
}