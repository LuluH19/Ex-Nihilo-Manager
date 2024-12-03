const { mongoose } = require("mongoose")

const personSchema = {
    nom: { type: String, required: true, trim:true },
    prenom: { type: String, required: true, trim:true },
    age: { type: Number, required:true},
    email: { type: String, required: true, minLength: 6, maxLength:30, trim:true, match:/[a-zA-Z0-9._\-]{1,30}[@][a-zA-Z0-9._\-]{4,12}[.]{1}[a-zA-Z]{2,4}/gm },
    password: { type: String, required: true, trim:true},
    telephone: { type: String, required: true, minLength:10, maxLength:10, match:/^0[1-9]\d{8}$/, trim:true},
    photo: { type: String, required: true, trim:true},
}

const eleveSchema = new mongoose.Schema({
    ...personSchema
}, { versionKey: false })

const profSchema = new mongoose.Schema({
    ...personSchema,
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' },
}, { versionKey: false })

const matiereSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim:true},
}, { versionKey: false })

const noteSchema = new mongoose.Schema({
    eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
    matiere : { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' }, 
    valeur: { type: Number, min : 0, max : 20 }
})



module.exports = { 
    eleveSchema,
    profSchema,
    matiereSchema,
    noteSchema
}