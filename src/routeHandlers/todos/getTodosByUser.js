const _ = require('lodash');
const { mySqlConn } = require('../../utils/db');

module.exports.getTodosByUser = async (req, res) => {
    try {
        //Take the filters from the user
        const { todoStatus, todoPriority } = req.query;
        const db = await mySqlConn();
        let filtersWhereClause = '';
        if(!_.isEmpty(todoStatus)){
            filtersWhereClause = `AND status = ${db.escape(todoStatus)}`
        }
        if(!_.isEmpty(todoPriority)){
            filtersWhereClause = `${filtersWhereClause} AND priority = ${db.escape(todoPriority)}`
        }

        const finalSqlQuery = `SELECT * FROM todos WHERE userId = ${db.escape(req.user.userId)} ${filtersWhereClause}`
        

        const result = await db.query(finalSqlQuery)
        return res.json({
            todos: result
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: 'Oops something went wrong!'})
    }
}