import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import ApiRouter from './routes/api/api.router'

require('dotenv').config()

const app: express.Application = express()
const PORT: number = Number(process.env.PORT) || 5000

app.use(cors({
  origin: ["https://smart-calendar-backend.herokuapp.com/", "https://smart-calendar-frontend.herokuapp.com/"],
  preflightContinue:false,
  credentials: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.use(morgan('dev'))
app.use('/api', ApiRouter)

async function appStart() {
    try {
        console.log('Connection to database...')

        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })

        console.log('App has successfully connected to the database...')

        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}...`)
        })
    } catch (err) {
        console.log('Database connection error: ', err.message)
        process.exit(1)
    }
}

appStart()

// error handle
app.use(function (err, req, res, next) {
    console.log('###############')
    console.log('ERROR')
    console.log(err.message)
    console.log('###############')

    res.status(500).send({ message: 'Oops, the server got sick' })
    res.end('')
})
