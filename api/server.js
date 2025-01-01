//import
const express = require("express")
const cors = require("cors")
var fs = require('fs')
var morgan = require('morgan')
const { eleveRouter, profRouter, vieScolaireRouter } = require("./src/router")
const { host, port } = require("./src/constant/config.const")

const app = express()

if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log', { recursive: true });
}
const accessLogStream = fs.createWriteStream('./log/access.log', { flags: 'a' })
//plugin
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(morgan(':status || :method :date[clf] || :response-time || :url || :user-agent', { stream: accessLogStream }))
app.use(morgan(':status || :method :date[clf] || :response-time || :url || :user-agent'))
//route
app.get('/', (req, res) => { res.send("exNihilo api") })
app.use('/eleve', eleveRouter)
app.use('/prof', profRouter)
app.use('/viescolaire', vieScolaireRouter)
app.use((req, res, next) => {
    return res.status(404).send({ "message": "page not found" })
})
//listen
app.listen({ host: host, port: port }, () => {
    console.log(`This server is listen on http://${host}:${port}`);
})