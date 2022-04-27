const bycrypt = require('bcryptjs')

module.exports.hash = (password) => bycrypt.hashSync(password, 10);

module.exports.compare = (password, hash) => bycrypt.compareSync(password, hash);