import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebHooks.js'


connectDB()

const app = express()

app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())

//API to listen to Clerk Webhooks
app.use('/api/clerk', clerkWebHooks)

app.get('/', (req, res) => res.send("api is working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))