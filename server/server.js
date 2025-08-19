import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebHooks.js'
import UserRouter from './routes/userRoutes.js'
import officeRouter from './routes/officeRoutes.js'
import connectCloudinary from './configs/cloudinary.js'
import workspaceRouter from './routes/workspaceRoute.js'
import bookingRouter from './routes/bookingRoutes.js'



connectDB()
connectCloudinary();

const app = express()

app.use(express.json())

app.use(cors())

app.use(clerkMiddleware())

// Clerk webhook needs raw body
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebHooks);


app.get('/', (req, res) => res.send("api is working"))
app.use('/api/user', UserRouter)
app.use('/api/offices', officeRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))