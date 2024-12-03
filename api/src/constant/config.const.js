const dotenv = require("dotenv")
dotenv.config()

const db_url = process.env.DB_URL || ""
const host = process.env.HOST || "localhost"
const port = process.env.PORT || 3000

module.exports = { db_url, host, port }