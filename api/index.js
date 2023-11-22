import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from '../api/routes/user.route.js'
import authRoutes from '../api/routes/auth.route.js'

//configs
dotenv.config()


// database connection
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Mongo is connected")
})
    .catch((err) => {
        console.log(err)
    })


// app  
const app = express()
// app listen at server
app.listen(3000, () => {
    console.log('server is running on port 3000!')
})

// allow json as input on backend
app.use(express.json())

// routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)






// error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})


