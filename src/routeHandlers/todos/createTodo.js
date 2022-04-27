const _ = require("lodash");
const { mySqlConn } = require('../../utils/db');
const { nanoid } = require('nanoid');

module.exports.createTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if(_.isEmpty(title) || !dueDate){
        return res.status(400).send({message: 'Please provide all the required fields.'});
    }

    let formattedDueDate = new Date(dueDate);
    let formattedStatus = status;
    if(_.isEmpty(formattedStatus)){
        formattedStatus = 'pending';
    }
    let formattedPriority = priority;
    if(_.isEmpty(formattedPriority)){
        formattedPriority = 'medium';
    }

    //Generate a todoId
    const todoId = `todo_${nanoid(12)}`


    const db = await mySqlConn();

    await db.query('INSERT INTO todos (todoId, title, description, status, priority, dueDate, userId) VALUES (?,?,?,?,?,?,?)', [
        todoId, title, description || null, formattedStatus, formattedPriority, formattedDueDate, req.user.userId
    ])

    return res.json({
        todo: {
            todoId,
            title,
            description: description || null,
            status: formattedStatus,
            priority: formattedPriority,
            dueDate: formattedDueDate,
            createdAt: new Date()
        }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Oops something went wrong." });
  }
};
