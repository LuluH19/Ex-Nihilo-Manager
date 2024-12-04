const vieScolaireRouter = require('express').Router()
const crypto = require("node:crypto")
const jwt = require("jsonwebtoken")
const { utilisateurModel } = require('../database/model.db')
const { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidAge } = require('../controller/check')
const { generateToken, verifyToken } = require("../middleware/jwt")

vieScolaireRouter.post("/login", async (req, res) => {
    const currentVieScolaire = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({message: "incorrect format vieScolaire"})
    }
    utilisateurModel.findOne({ email: currentVieScolaire.email, password: currentVieScolaire.password }).then(
        vieScolaire => {
            if (!vieScolaire) {    
                return res.status(400).send({ message: "vieScolaire not found" })
            }else if(vieScolaire.role!="vieScolaire"){
                return res.status(400).send({ message: "not a vieScolaire" })
            }else{
                return res.send(generateToken(vieScolaire))
            }
        }
    )
    
})
//Create
vieScolaireRouter.post("/register", async (req, res) => {
    const currentVieScolaire = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        age: req.body.age || "",
        telephone: req.body.telephone || "",
        photo: req.body.photo || "",
        role : "vieScolaire"
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({message: "incorrect format vieScolaire"})
    }
    if (!isValidEmail(currentVieScolaire.email)) {
        return res.status(400).send({ message: "incorrect mail format" })
    }
    if (!isValidPassword(req.body.password)) {
        return res.status(400).send({ message: "incorrect password format" })
    }
    if (!isValidTel(currentVieScolaire.telephone)){
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if(!isValidAge(currentVieScolaire.age)){
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOne({email: req.body.email}).then(
        data => {
            if(!data){
                utilisateurModel.create(currentVieScolaire).then(
                    (vieScolaire)=>{
                        return res.send(generateToken(vieScolaire))
                    }
                )
            }else{
                return res.status(404).send({message: "already exist"})
            }
        }
    )
})

vieScolaireRouter.post("/info", async (req, res)=>{
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({message: "incorrect format vieScolaire"})
    }
    if (!token.trim()) {
        return res.status(400).send({message: "no token found"})
    }
    if(!verifyToken(token)){
        return res.status(400).send({message: "unknow token"})
    }
    utilisateurModel.findOne(currentVieScolaire,{password:0, _id:0}).then(
        data => {
            if (!data) {    
                return res.status(400).send({ message: "vieScolaire not found" })
            }else{
                return res.send(data)
            }
        }
    )
})

//Delete
vieScolaireRouter.post("/delete", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({message: "incorrect format vieScolaire"})
    }
    if (!token.trim()) {
        return res.status(400).send({message: "no token found"})
    }
    if(!verifyToken(token)){
        return res.status(400).send({message: "unknow token"})
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {    
                return res.status(400).send({ message: "vieScolaire not found" })
            }else{
                utilisateurModel.findOneAndDelete(currentVieScolaire).then(
                    () => {return res.send({message : "vieScolaire delete"})}
                )
            }
        }
    )
})
//Update
vieScolaireRouter.post("/update", async (req, res) => {
    const token = req.headers.authorization || ""
    const updatedVieScolaire = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        photo: req.body.photo || "",
        age: req.body.age || "",
        telephone : req.body.telephone || ""
    }

    if(!verifyToken(token)){
        return res.status(400).send({message: "unknow token"})
    }
    const currentUser = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
    }
    if (!isValidDataObject(currentUser)) {
        return res.status(400).send({message: "missing "})
    }
    if (!isValidTel(updatedVieScolaire.telephone)){
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if(!isValidAge(updatedVieScolaire.age)){
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOneAndUpdate(
        { email: updatedVieScolaire.email, password: updatedVieScolaire.password},
        { nom: updatedVieScolaire.nom, prenom: updatedVieScolaire.prenom, photo: updatedVieScolaire.photo, age : updatedVieScolaire.age, telephone : updatedVieScolaire.telephone }
    ).then(
        data => {
            if(!data){
                return res.send({ message: "vieScolaire not found" })
            }
            return res.send(updatedVieScolaire)
        }
    )     
})

module.exports = { vieScolaireRouter }