import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        const url = `${db.connection.host}:${db.connection.port}`;
        // console.log(`MongoDB conectado en: ${url}`);
        // console.log(`Base de datos: ${db.connection.name} ${new Date().toLocaleString('es-MX')}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);        
    }
}

export default conectarDB;