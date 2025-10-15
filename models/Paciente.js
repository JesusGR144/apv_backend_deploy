import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    propietario: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),        
    },
    sintomas: {
        type: String,
        required: true,
        trim: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    }
}, {
    timestamps: true
});

const Paciente = mongoose.model('Paciente', pacientesSchema);

export default Paciente;