const _ = require("lodash");
const { mySqlConn } = require('../../utils/db');

module.exports.updateTodo = async (req, res) => {
  try {
    //const { title, description, status, priority, dueDate } = req.body;
    const {todoId} = req.params;

    let toBeUpdatedFields = {};

    _.forIn(req.body, (val, key) => {
        if(!_.isEmpty(val)){
            toBeUpdatedFields[key] = val;
        }
    })

    if(!_.isEmpty(toBeUpdatedFields)){
        const db = await mySqlConn();
        //perporm db operations
        const sqlSetValues = [];
        _.forIn(toBeUpdatedFields, (val, key) => {
            sqlSetValues.push(`${key}=${db.escape(val)}`) //['title='shhss'', 'description='adjdhwqjd'']
        })

        const sqlSetString = _.toString(sqlSetValues);

        const sqlUpdateStatement = `UPDATE todos SET ${sqlSetString} WHERE todoId=${db.escape(todoId)}`;
        await db.query(sqlUpdateStatement);
    }

    return res.status(200).send({message: 'Todo updated.'})
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Oops something went wrong." });
  }
};


// todo_fgxXMb1M4Ged