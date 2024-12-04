const dotenv = require("dotenv")
const dotenvExpand = require('dotenv-expand')
dotenvExpand.expand(dotenv.config())
console.log(process.env)
const db_url = process.env.DB_URL || ""
const host = process.env.HOST || "localhost"
const port = process.env.PORT || 3000
const jwt_secret = process.env.JWT_SECRET || ""

module.exports = { db_url, host, port, jwt_secret }