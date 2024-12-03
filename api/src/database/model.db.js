const { default: mongoose } = require("mongoose")
const { db_url } = require("../constant/config.const")
const { eleveSchema, profSchema, matiereSchema, noteSchema } = require("./schema.db")

mongoose.connect(db_url)
        .then(() => console.log('Connecté avec succès à MongoDB'))
        .catch((err) => console.error('Erreur lors de la connexion à MongoDB :', err));

const eleveModel = mongoose.model("Eleve", eleveSchema)
const profModel = mongoose.model("Prof", profSchema)
const matiereModel = mongoose.model("Matiere", matiereSchema)
const noteModel = mongoose.model("Note", noteSchema)

module.exports = { 
    eleveModel,
    profModel,
    matiereModel,
    noteModel
}