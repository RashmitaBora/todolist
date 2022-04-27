const _  = require('lodash')
const passwordUtils = require('../../utils/passwordUtils')
const { nanoid } = require('nanoid');
const { mySqlConn } = require('../../utils/db')
const {issueNewToken} = require('../../utils/tokens')


module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;


        if(_.isEmpty(email) || _.isEmpty(password)) {
            return res.status(400).send({message: 'Please provide all the required fields.'});
        }

        const db = await mySqlConn();

        const result = (await db.query('SELECT * FROM users WHERE email = ?', [email]))[0];

        if(_.isEmpty(result)){
            return res.status(401).send({message: 'Invalid username or password'});
        }

        //Check the user provided password with the password that is saved in databse
        if(!passwordUtils.compare(password, _.get(result, 'password'))){
            return res.status(401).send({message: 'Invalid username or password'})
        }

        //If all ok then generate the tokens
        const tokens = await issueNewToken(result.userId, result.name, result.email, result.isVerified);

        return res.json({
            token: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: 'Oops something went wrong.'})
    }
}