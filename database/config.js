
const mongoose = require('mongoose')

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        })

        console.log('Conectado a la bd')
    } catch (error) {
        console.log(error)
        throw new Error('Error iniciado la bd')
        
    }

}


module.exports = {
    dbConnection
}