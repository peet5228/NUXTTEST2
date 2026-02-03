require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors ({
    origin:'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// ===== Public endpoint API =====
const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

// ===== Staff endpoint API =====


// ===== Evaluatee endpoint API =====
const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

// ===== Committee endpoint API =====



app.use((req,res) => res.status(404).json({message:'Invalid Routes!'}))

app.listen(3001 , () => console.log("Server Running On Port 3001"))