//import
const express = require("express")
const cors = require("cors")
const app = express()
const { eleveRouter } = require("./src/router/eleve.route")
const { profRouter } = require("./src/router/prof.route")
const { host, port } = require("./src/constant/config.const")
//plugin
app.use(cors())
app.use(express.json())
//route
app.get('/', (req, res) => { res.send("exNihilo api") })
app.use('/eleve', eleveRouter)
app.use('/prof', profRouter)
app.use((req, res, next) => {
    return res.status(404).send({ "message": "page not found" })
})
//listen
app.listen({ host: host, port: port }, () => {
    console.log(`This server is listen on http://${host}:${port}`);
})