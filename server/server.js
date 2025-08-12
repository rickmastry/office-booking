import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebHooks.js'



connectDB()

const app = express()

app.use(cors())
app.use(clerkMiddleware())

// Clerk webhook needs raw body
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebHooks);

app.use(express.json())

app.get('/', (req, res) => res.send("api is working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))