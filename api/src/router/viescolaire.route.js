const vieScolaireRouter = require('express').Router()
const crypto = require("node:crypto")
const jwt = require("jsonwebtoken")
const { utilisateurModel, classeModel, coursModel, noteModel } = require('../database/model.db')
const { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidPosInt } = require('../controller/check')
const { generateToken, verifyToken } = require("../middleware/jwt")
const { cp } = require('node:fs')

vieScolaireRouter.post("/login", async (req, res) => {
    const currentVieScolaire = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    utilisateurModel.findOne({ email: currentVieScolaire.email, password: currentVieScolaire.password }).then(
        vieScolaire => {
            if (!vieScolaire) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (vieScolaire.role != "vieScolaire") {
                return res.status(400).send({ message: "not a vieScolaire" })
            } else {
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
        role: "vieScolaire"
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!isValidEmail(currentVieScolaire.email)) {
        return res.status(400).send({ message: "incorrect mail format" })
    }
    if (!isValidPassword(req.body.password)) {
        return res.status(400).send({ message: "incorrect password format" })
    }
    if (!isValidTel(currentVieScolaire.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(currentVieScolaire.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOne({ email: req.body.email }).then(
        data => {
            if (!data) {
                utilisateurModel.create(currentVieScolaire).then(
                    (vieScolaire) => {
                        return res.send(generateToken(vieScolaire))
                    }
                )
            } else {
                return res.status(404).send({ message: "already exist" })
            }
        }
    )
})

vieScolaireRouter.post("/info", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire, { password: 0, _id: 0 }).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
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
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                utilisateurModel.findOneAndDelete(currentVieScolaire).then(
                    () => { return res.send({ message: "vieScolaire delete" }) }
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
    if (!isValidTel(updatedVieScolaire.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(updatedVieScolaire.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOneAndUpdate(
        { email: updatedVieScolaire.email, password: updatedVieScolaire.password },
        { nom: updatedVieScolaire.nom, prenom: updatedVieScolaire.prenom, photo: updatedVieScolaire.photo, age: updatedVieScolaire.age, telephone: updatedVieScolaire.telephone }
    ).then(
        data => {
            if (!data) {
                return res.send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                return res.send(updatedVieScolaire)
            }
        }
    )
})

vieScolaireRouter.post("/eleves", (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire, { password: 0, _id: 0 }).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                utilisateurModel.find({ role: "eleve" }, { password: 0 }).then(
                    eleves => {
                        noteModel.find().populate({ path: "matiere", select: "nom" }).then(
                            notes => {
                                const output = eleves.map(eleve => ({
                                    ...eleve.toObject(),
                                    notes: notes.filter(note => note.eleve.toString() === eleve._id.toString())
                                        .map(note => ({ valeur: note.valeur, matiere: note.matiere.nom }))
                                }))
                                res.send(Array.isArray(output) ? output : [])
                            })
                    }
                )
            }
        }
    )
})


vieScolaireRouter.post("/classes/show", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                classeModel.find({}).populate('eleves', "_id nom prenom email telephone photo").then(classes => {
                    return res.send(classes)
                })
            }
        }
    )
})
vieScolaireRouter.post("/classes/info", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentClasse = req.body.idClasse
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                classeModel.findById(currentClasse).populate('eleves', "_id nom prenom email telephone photo").then(classe => {
                    if (!classe) {
                        return res.status(400).send({ message: "classe not found" })
                    } else {
                        return res.send(classe)
                    }
                })
            }
        }
    )
})
vieScolaireRouter.post("/classes/create", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentClasse = {
        nom: req.body.nom,
        nbPlace: req.body.nbPlace
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!isValidDataObject(currentClasse)) {
        return res.status(400).send({ message: "incorrect format classe" })
    }
    if (!isValidPosInt(currentClasse.nbPlace)) {
        return res.status(400).send({ message: "nbplaces not a positive int" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                classeModel.create(currentClasse).then(classe => {
                    return res.send(classe)
                })
            }
        }
    )
})
vieScolaireRouter.post("/classes/remove", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentClasse = {
        id: req.body.idclasse
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!isValidDataObject(currentClasse)) {
        return res.status(400).send({ message: "incorrect format classe" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }

    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                classeModel.findByIdAndDelete(currentClasse.id).then(classe => {
                    return res.send({ message: "classe deleted" })
                })
            }
        }
    )
})
vieScolaireRouter.post("/classes/eleves/add", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentEleve = {
        id: req.body.idEleve
    }
    const currentClasse = {
        id: req.body.idClasse
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format classe" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                classeModel.findById(currentClasse.id).then(classe => {
                    if (!classe) {
                        return res.send({ message: "classe not found" })
                    } else {
                        utilisateurModel.findById(currentEleve.id).then(eleve => {
                            if (!eleve) {
                                return res.status(400).send({ message: "eleve not found" })
                            } else if (eleve.role != "eleve") {
                                return res.status(400).send({ message: "not a eleve" })
                            } else {
                                if (classe.eleves.includes(currentEleve.id)) {
                                    return res.status(400).send({ message: "eleve already in classe" });
                                } else if (classe.nbPlace == classe.eleves.length) {
                                    return res.status(400).send({ message: "classe is full" })
                                } else {
                                    classe.eleves.push(currentEleve.id)
                                    classe.save().then(
                                        () => { return res.send({ message: "eleve added" }) }
                                    )
                                }
                            }
                        })
                    }
                })
            }
        }
    )
})
vieScolaireRouter.post("/classes/eleves/remove", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentEleve = {
        id: req.body.idEleve
    }
    const currentClasse = {
        id: req.body.idClasse
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!isValidDataObject(currentEleve)) {
        return res.status(400).send({ message: "incorrect format classe" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                classeModel.findById(currentClasse.id).then(classe => {
                    if (!classe) {
                        return res.send({ message: "classe not found" })
                    } else {
                        utilisateurModel.findById(currentEleve.id).then(eleve => {
                            if (!eleve) {
                                return res.status(400).send({ message: "eleve not found" })
                            } else if (eleve.role != "eleve") {
                                return res.status(400).send({ message: "not a eleve" })
                            } else {
                                if (!classe.eleves.includes(currentEleve.id)) {
                                    return res.status(400).send({ message: "eleve not in classe" })
                                } else {
                                    classe.eleves.splice(classe.eleves.indexOf(currentEleve.id), 1)
                                    classe.save().then(
                                        () => { return res.send({ message: "eleve remove" }) }
                                    )
                                }
                            }
                        })
                    }
                })
            }
        }
    )
})

vieScolaireRouter.post("/cours", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentVieScolaire = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentVieScolaire)) {
        return res.status(400).send({ message: "incorrect format vieScolaire" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentVieScolaire).then(
        data => {
            if (!data) {
                return res.status(400).send({ message: "vieScolaire not found" })
            } else if (data.role != "vieScolaire") {
                return res.status(400).send({ message: "user isnt a vieScolaire" })
            } else {
                coursModel.find().populate({ path: "matiere", select: "nom" }).populate({ path: "prof", select: "_id email nom prenom" }).populate({ path: "classe", select: "nom" }).then(cours => {
                    res.send(Array.isArray(cours) ? cours : [])
                })
            }
        }
    )
})


module.exports = { vieScolaireRouter }