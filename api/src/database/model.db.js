const { default: mongoose } = require("mongoose")
const { db_url } = require("../constant/config.const")
const { utilisateurSchema, matiereSchema, noteSchema, coursSchema, classeSchema } = require("./schema.db")

mongoose.connect(db_url)
    .then(() => console.log('Connecté avec succès à MongoDB'))
    .catch((err) => console.error('Erreur lors de la connexion à MongoDB :', err));

const utilisateurModel = mongoose.model("Utilisateur", utilisateurSchema)
const matiereModel = mongoose.model("Matiere", matiereSchema)
const noteModel = mongoose.model("Note", noteSchema)
const coursModel = mongoose.model("Cours", coursSchema)
const classeModel = mongoose.model("Classe", classeSchema)

module.exports = {
    utilisateurModel,
    matiereModel,
    noteModel,
    coursModel,
    classeModel
}