const jwt = require('jsonwebtoken'); 
const _ = require('lodash');
const { promisify } = require('util')

const jwtSign = promisify(jwt.sign);
const jwtverify = promisify(jwt.verify);


module.exports.issueNewToken = async (userId, name, email, isVerified) => {
    try {
        const signOptions = {
            issuer: 'todo_web_server',
            subject: userId,
            algorithm: 'RS256'
        }

        const payload = {
            userId,
            name,
            email,
            isVerified,
        }

        const privatekey = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('utf-8');

        //generate the access token
        const accessToken = await jwtSign({
            ...payload,
            type: 'access'
        },
        {
            key: privatekey,
            passphrase: 'todo_web_server'
        },
        {
            ...signOptions,
            expiresIn: '1h'
        })

        //Generate the refresh token
        const refreshToken = await jwtSign({
            userId, email, type: 'refresh'
        }, {
            key: privatekey,
            passphrase: 'todo_web_server'
        }, {
            ...signOptions, expiresIn: '30 days'
        })

        return {
            accessToken, 
            refreshToken
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}