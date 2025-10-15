import Paciente from "../models/Paciente.js"

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.error(error)
    }
}

const obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
        res.json(pacientes);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ msg: 'Error al obtener pacientes' });
    }
}

const obtenerPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: 'El usuario no fue encontrado' });
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no válida' });
        }

        return res.json(paciente);

    } catch (error) {
        // Si el id no tiene formato válido o cualquier otro error
        return res.status(400).json({ msg: 'Error al obtener el paciente' });
    }
};

const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        let paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: 'El usuario no fue encontrado' });
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no válida' });
        }

        // Actualiza solo los campos enviados
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();

        return res.json(pacienteActualizado);

    } catch (error) {
        return res.status(400).json({ msg: 'Error al actualizar el paciente' });
    }
};

const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: 'El usuario no fue encontrado' });
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no válida' });
        }

        await paciente.deleteOne(); // ✅ método correcto
        return res.json({ msg: 'Paciente eliminado correctamente' });

    } catch (error) {
        return res.status(400).json({ msg: 'Error al eliminar el paciente' });
    }
};


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}