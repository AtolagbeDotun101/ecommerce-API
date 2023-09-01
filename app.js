const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
 require('express-async-errors')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require("./routes/orderRoutes");
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const xss = require('xss-clean')
const cors = require('cors')
const helmet = require('helmet')
const expressRateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')


const port = process.env.PORT || 5000

app.set('trust proxy', 1)
app.use(expressRateLimiter({
    windosMs: 15 * 60 * 1000,
    max: 60
}))

app.use(cors())
app.use(xss())
app.use(helmet())
app.use(mongoSanitize())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgan('dev'))
app.use(express.json())

app.use(fileUpload())
app.use(express.static('./uploads'))



// routes
app.use(express.static('./public'))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use("/api/v1/orders", orderRouter);

app.use(notFound)
app.use(errorHandler)

const start = async () => {
    try {
       await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()
