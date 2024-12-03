const eleveRouter = require('express').Router()
const crypto = require("node:crypto")
const { eleveModel } = require('../database/model.db')
const { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidAge } = require('../controller/check')

eleveRouter.post("/login", async (req, res) => {
    const currentUser = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
    }
    if (!isValidDataObject(currentUser)) {
        return res.status(400).send({message: "incorrect format user"})
    }
    eleveModel.findOne({ email: currentUser.email, password: currentUser.password }).then(
        data => {
            if (!data) {    
                return res.status(400).send({ message: "user not found" })
            }
            return res.send(data)
        }
    )
    
})
//Create
eleveRouter.post("/register", async (req, res) => {
    const currentUser = {
        nom: req.body.nom || "",//obligatoire
        prenom: req.body.prenom || "",//obligatoire
        email: req.body.email || "",//obligatoire
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",//obligatoire
        age: req.body.age || "",
        telephone: req.body.telephone || "",
        photo: req.body.photo || "",//obligatoire
    }
    console.log(currentUser,isValidDataObject(currentUser))
    if (!isValidDataObject(currentUser)) {
        return res.status(400).send({message: "incorrect format user"})
    }
    if (!isValidEmail(currentUser.email)) {
        return res.status(400).send({ message: "incorrect mail format" })
    }
    if (!isValidPassword(req.body.password)) {
        return res.status(400).send({ message: "incorrect password format" })
    }
    if (!isValidTel(currentUser.telephone)){
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if(!isValidAge(currentUser.age)){
        return res.status(400).send({ message: "incorrect age format" })
    }
    eleveModel.findOne({email: req.body.email}).then(
        data => {
            if(!data){
                eleveModel.insertMany([currentUser]).then(
                    ()=>{return res.send(currentUser)}
                )
            }else{
                return res.status(404).send({message: "already exist"})
            }
        }
    )
})
//Delete
eleveRouter.post("/delete", async (req, res) => {
    const currentUser = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
    }
    if (!isValidDataObject(currentUser)) {
        return res.status(400).send({message: "incorrect format user"})
    }
    eleveModel.findOne({ email: currentUser.email, password: currentUser.password }).then(
        data => {
            if (!data) {    
                return res.status(400).send({ message: "user not found" })
            }
            eleveModel.findOneAndDelete({ email: currentUser.email, password: currentUser.password }).then(
                res.send({message : "user delete"})
            )
        }
    )
    
})
//Update
eleveRouter.post("/update", async (req, res) => {
    const updatedUser = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        photo: req.body.photo || "",
        age: req.body.age || "",
        telephone : req.body.telephone || ""
    }
    if (!isValidDataObject(updatedUser)) {
        return res.status(400).send({message: "incorrect format user"})
    }
    if (!isValidTel(updatedUser.telephone)){
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if(!isValidAge(updatedUser.age)){
        return res.status(400).send({ message: "incorrect age format" })
    }
    eleveModel.findOneAndUpdate(
        { email: updatedUser.email, password: updatedUser.password},
        { nom: updatedUser.nom, prenom: updatedUser.prenom, photo: updatedUser.photo, age : updatedUser.age, telephone : updatedUser.telephone }
    ).then(
        data => {
            if(!data){
                return res.send({ message: "user not found" })
            }
            return res.send(updatedUser)
        }
    )     
    
})

module.exports = { eleveRouter }