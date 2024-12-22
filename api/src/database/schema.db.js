const { mongoose } = require("mongoose")

const utilisateurSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, minLength: 6, maxLength: 30, trim: true, match: /[a-zA-Z0-9._\-]{1,30}[@][a-zA-Z0-9._\-]{4,12}[.]{1}[a-zA-Z]{2,4}/gm },
    password: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, minLength: 10, maxLength: 10, match: /^0[1-9]\d{8}$/, trim: true },
    photo: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }
}, { versionKey: false })

const matiereSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    prof: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', require: true },
}, { versionKey: false })

const classeSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }],
    nbPlace: { type: Number, required: true }
}, { versionKey: false })

const noteSchema = new mongoose.Schema({
    eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
    valeur: { type: Number, min: 0, max: 20, required: true }
}, { versionKey: false })

const coursSchema = new mongoose.Schema({
    prof: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', require: true },
    classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', require: true },
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
    debut: { type: Date, require: true },
    fin: { type: Date, require: true }
}, { versionKey: false })

module.exports = {
    utilisateurSchema,
    matiereSchema,
    noteSchema,
    classeSchema,
    coursSchema
}