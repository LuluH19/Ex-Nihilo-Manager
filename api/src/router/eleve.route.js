const eleveRouter = require('express').Router()
const crypto = require("node:crypto")
const jwt = require("jsonwebtoken")
const { utilisateurModel, noteModel, matiereModel, classeModel, coursModel } = require('../database/model.db')
const { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidPosInt } = require('../controller/check')
const { generateToken, verifyToken } = require("../middleware/jwt")

eleveRouter.post("/login", async (req, res) => {
    const currentEleve = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : ""
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format eleve" })
    }
    utilisateurModel.findOne({ email: currentEleve.email, password: currentEleve.password }).then(
        eleve => {
            if (!eleve) {
                return res.status(400).send({ message: "eleve not found" })
            } else if (eleve.role != "eleve") {
                return res.status(400).send({ message: "not a eleve" })
            } else {
                return res.send(generateToken(eleve))
            }
        }
    )

})
//Create
eleveRouter.post("/register", async (req, res) => {
    const currentEleve = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        age: req.body.age || "",
        telephone: req.body.telephone || "",
        photo: req.body.photo || "",
        role: "eleve"
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format eleve" })
    }
    if (!isValidEmail(currentEleve.email)) {
        return res.status(400).send({ message: "incorrect mail format" })
    }
    if (!isValidPassword(req.body.password)) {
        return res.status(400).send({ message: "incorrect password format" })
    }
    if (!isValidTel(currentEleve.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(currentEleve.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOne({ email: req.body.email }).then(
        data => {
            if (!data) {
                utilisateurModel.create(currentEleve).then(
                    (eleve) => {
                        return res.send(generateToken(eleve))
                    }
                )
            } else {
                return res.status(404).send({ message: "already exist" })
            }
        }
    )
})

eleveRouter.post("/info", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentEleve = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format eleve" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentEleve, { password: 0, _id: 0 }).then(
        eleve => {
            if (!eleve) {
                return res.status(400).send({ message: "eleve not found" })
            } else {
                return res.send(eleve)
            }
        }
    )
})

eleveRouter.post("/notes", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentEleve = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format eleve" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentEleve).then(eleve => {
        if (!eleve) {
            return res.status(400).send({ message: "eleve not found" })
        } else {
            noteModel.find({ eleve: currentEleve._id }).populate({ path: "matiere", target: "nom" }).then(notes => {
                res.send(Array.isArray(notes) ? notes : [])
            })
        }
    })
})

//Delete
eleveRouter.post("/delete", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentEleve = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format eleve" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentEleve).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "eleve not found" })
            } else {
                utilisateurModel.findOneAndDelete(currentEleve).then(
                    () => { return res.send({ message: "eleve delete" }) }
                )
            }
        }
    )
})
//Update
eleveRouter.post("/update", async (req, res) => {
    const token = req.headers.authorization || ""
    const updatedEleve = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        photo: req.body.photo || "",
        age: req.body.age || "",
        telephone: req.body.telephone || ""
    }

    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    const currentUser = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
    }
    if (!isValidDataObject(currentUser)) {
        return res.status(400).send({ message: "missing " })
    }
    if (!isValidTel(updatedEleve.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(updatedEleve.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOneAndUpdate(
        { email: updatedEleve.email, password: updatedEleve.password },
        { nom: updatedEleve.nom, prenom: updatedEleve.prenom, photo: updatedEleve.photo, age: updatedEleve.age, telephone: updatedEleve.telephone }
    ).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "eleve not found" })
            }
            return res.send(updatedEleve)
        }
    )
})

eleveRouter.post("/cours", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentEleve = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format eleve" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentEleve).then(eleve => {
        if (!eleve) {
            return res.status(400).send({ message: "eleve not found" })
        } else {
            classeModel.findOne({ eleves: currentEleve._id }).then(classe => {
                if (!classe) {
                    return res.status(400).send({ message: "no class found for this student" })
                } else {
                    coursModel.find({ classe: classe._id })
                        .populate({ path: "prof", select: "_id email nom prenom" })
                        .populate({ path: "matiere", select: "nom _id" })
                        .populate({ path: "classe", select: "nom _id" })
                        .then(cours => {
                            res.send(Array.isArray(cours) ? cours : [])
                        })
                }
            })
        }
    })
})

module.exports = { eleveRouter }