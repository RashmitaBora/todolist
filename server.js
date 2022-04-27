require('dotenv').config()
const http = require('http');
const app = require('./src/routes')

const server = http.createServer(app)

const port = process.env.SERVER_PORT || 6003;
server.listen(port, console.log(`Server is running at port ${port}`))
