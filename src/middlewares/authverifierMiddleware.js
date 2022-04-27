const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {promisify} = require('util');


const jwtVerify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
    const authorization = req.header('Authorization') || '';
    const [type, token] = authorization.split(' ');
    if (!token || type !== 'Bearer') {
        return res.sendStatus(401);
    }

    try {

        const publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64').toString('utf-8');
        const decoded = await jwtVerify(token, publicKey, {
            issuer: 'todo_web_server',
            algorithm: 'RS256'
        })

        if(decoded.type === 'access'){
            req.user = _.omit(decoded, ['type', 'iat', 'iss', 'sub']);
            return next();
        }
        
        return res.sendStatus(401);


    } catch (error) {
        console.log(error);
        return res.sendStatus(401);
    }

}

//Authorization: Bearer ldlsxfxlkasjdklaszdlksmdlkmdklm

