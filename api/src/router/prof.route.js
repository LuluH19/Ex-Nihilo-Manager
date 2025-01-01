const profRouter = require('express').Router()
const crypto = require("node:crypto")
const jwt = require("jsonwebtoken")
const { utilisateurModel, matiereModel, noteModel, classeModel } = require('../database/model.db')
const { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidPosInt } = require('../controller/check')
const { generateToken, verifyToken } = require('../middleware/jwt')

profRouter.post("/login", async (req, res) => {
    const currentProf = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
    }
    if (!isValidDataObject(currentProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
    }
    utilisateurModel.findOne({ email: currentProf.email, password: currentProf.password }).then(
        prof => {
            if (!prof) {
                return res.status(400).send({ message: "prof not found" })
            } else if (prof.role != "prof") {
                return res.status(400).send({ message: "not a prof" })
            } else {
                return res.send(generateToken(prof))
            }
        }
    )

})
//Create
profRouter.post("/register", async (req, res) => {
    const currentProf = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        age: req.body.age || "",
        telephone: req.body.telephone || "",
        photo: req.body.photo || "",
        role: "prof"
    }
    const currentMatiere = req.body.matiere || ""
    console.log(req.body)
    if (!isValidDataObject(currentProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
    }
    if (!isValidEmail(currentProf.email)) {
        return res.status(400).send({ message: "incorrect mail format" })
    }
    if (!isValidPassword(req.body.password)) {
        return res.status(400).send({ message: "incorrect password format" })
    }
    if (!isValidTel(currentProf.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(currentProf.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }
    if (!currentMatiere.trim()) {
        return res.status(400).send({ message: "no topic found" })
    }

    utilisateurModel.findOne({ email: req.body.email }).then(
        data => {
            if (!data) {
                utilisateurModel.create(currentProf).then(
                    prof => {
                        matiereModel.create({ nom: currentMatiere, prof: prof._id }).then((data) => {
                            return res.status(200).send(generateToken(prof))
                        })
                    }
                )
            } else {
                return res.status(404).send({ message: "already exist" })
            }
        }
    )
})

profRouter.post("/info", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentProf = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentProf, { password: 0, _id: 0 }).then(
        prof => {
            if (!prof) {
                return res.status(400).send({ message: "prof not found" })
            } else {
                matiereModel.findOne({ prof: currentProf._id }).then(
                    matiere => {
                        if (!matiere) {
                            return res.status(400).send({ message: "matiere not found" })
                        } else {
                            return res.send({ prof, matiere: matiere.nom })
                        }
                    }
                )
            }
        }
    )
})

//Delete
profRouter.post("/delete", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentProf = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    if (!isValidDataObject(currentProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    utilisateurModel.findOne(currentProf).then(
        prof => {
            if (!prof) {
                return res.status(400).send({ message: "prof not found" })
            }
            utilisateurModel.findOneAndDelete(currentProf).then(
                () => {
                    matiereModel.findOneAndDelete({ prof: prof._id }).then(
                        () => {
                            return res.send({ message: "prof delete" })
                        }
                    )

                }
            )
        }
    )
})
//Update
profRouter.post("/update", async (req, res) => {
    const token = req.headers.authorization || ""
    const updatedProf = {
        nom: req.body.nom || "",
        prenom: req.body.prenom || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        photo: req.body.photo || "",
        age: req.body.age || "",
        telephone: req.body.telephone || "",
        matiere: req.body.matiere || ""
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    if (!isValidDataObject(updatedProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
    }
    if (!isValidTel(updatedProf.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(updatedProf.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }
    utilisateurModel.findOneAndUpdate(
        { email: updatedProf.email, password: updatedProf.password },
        { nom: updatedProf.nom, prenom: updatedProf.prenom, photo: updatedProf.photo, age: updatedProf.age, telephone: updatedProf.telephone, matiere: updatedProf.matiere, matiere: updatedProf.matiere }
    ).then(
        data => {
            if (!data) {
                return res.send({ message: "prof not found" })
            }
            return res.send(updatedProf)
        }
    )

})
profRouter.post("/notes/eleve", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentProf = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentEleve = req.body.emailEleve
    if (!isValidDataObject(currentProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
    }
    if (!token.trim()) {
        return res.status(400).send({ message: "no token found" })
    }
    if (!verifyToken(token)) {
        return res.status(400).send({ message: "unknow token" })
    }
    if (!currentEleve) {
        return res.status(400).send({ message: "missing eleve" })
    }
    utilisateurModel.findOne(currentProf).then(
        prof => {
            if (!prof) {
                return res.send({ message: "prof not found" })
            } else {
                utilisateurModel.findOne({_id:currentEleve}).then(eleve=>{
                    if(!eleve){
                        return res.send({message:"eleve not found"})
                    }else{
                        noteModel.find({ eleve: currentEleve._id }).populate({ path: 'matiere', select: 'nom' }).then(notes=>{
                            return res.send(Array.isArray(notes) ? notes : [])
                        })
                    }
                })
            }
        }
    )
})

profRouter.post("/notes/add", async (req, res) => {
    const token = req.headers.authorization || ""
    const decodedToken = jwt.decode(token)
    const currentProf = {
        email: decodedToken.email || "",
        _id: decodedToken.id || "",
        role: decodedToken.role || ""
    }
    const currentEleve = {
        email: req.body.emailEleve || "",
        note: req.body.note || ""
    }
    if (!isValidDataObject(currentProf)) {
        return res.status(400).send({ message: "incorrect format prof" })
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
    utilisateurModel.findOne(currentProf).then(
        prof => {
            if (!prof) {
                return res.send({ message: "prof not found" })
            } else {
                utilisateurModel.findOne({ email: currentEleve.email }).then(
                    eleve => {
                        if (!eleve) {
                            return res.send({ message: "eleve not found" })
                        } else if (eleve.role != "eleve") {
                            return res.send({ message: "eleves isnt a eleve" })
                        } else {
                            matiereModel.findOne({ prof: prof._id }).then(
                                matiere => {
                                    if (!matiere) {
                                        return res.send({ message: "matiere not found" })
                                    } else {
                                        noteModel.create({ eleve: eleve._id, matiere: matiere._id, valeur: currentEleve.note }).then(() => {
                                            return res.send({ message: "note added" })
                                        })
                                    }
                                }
                            )
                        }
                    }
                )
            }
        }
    )
})


module.exports = { profRouter }