const express = require('express');
const { signup } = require('./routeHandlers/auth/signup');
const { signin } = require('./routeHandlers/auth/signin')
const authVerifierMiddleWare = require('./middlewares/authverifierMiddleware')
const {createTodo} = require('./routeHandlers/todos/createTodo')
const {getTodosByUser} = require('./routeHandlers/todos/getTodosByUser')
const {updateTodo} = require('./routeHandlers/todos/updateTodo')
const {updateProfileInfo} = require('./routeHandlers/auth/updateProfileInfo')

const app = express()


module.exports = app;

app.use(express.urlencoded({extended: true}));
app.use(express.json());




app.post('/api/auth/signup', signup);

app.post('/api/auth/login', signin)

app.get('/healthCheck', (req, res) => {
    res.sendStatus(200);
})

app.use(authVerifierMiddleWare);

app.post('/api/createTodo', createTodo);

app.get('/api/getTodosByUser', getTodosByUser)

app.put('/api/updateTodo/:todoId', updateTodo)

app.put('/api/user/updateUserInfo', updateProfileInfo)