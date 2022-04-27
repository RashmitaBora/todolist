const _  = require('lodash')
const passwordUtils = require('../../utils/passwordUtils')
const { nanoid } = require('nanoid');
const { mySqlConn } = require('../../utils/db')


module.exports.signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;


        if(_.isEmpty(email) || _.isEmpty(password) || _.isEmpty(confirmPassword)) {
            return res.status(400).send({message: 'Please provide all the required fields.'});
        }

        //If any of these are not empty go ahead to check whether both passwords match or not
        if(password !== confirmPassword){
            return res.status(400).send({message: 'Both the passwords donot match.'});
        }

        //Generate a user Id
        const userId = `usr_${nanoid(12)}`;
        //Hash the password
        const hashedPassword = passwordUtils.hash(password);

        console.log(hashedPassword);

        const db = await mySqlConn();

        await db.query('INSERT INTO users (userId, email, password) VALUES(?,?,?)', [userId, email, hashedPassword]);

        return res.json({
            user: {
                name: null,
                userId: userId,
                email: email,
                isVerified: false,
                createdAt: new Date(),
                lastUpdated: new Date()
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: 'Oops something went wrong.'})
    }
}