const express = require("express")
const app = express();
const cors = require("cors");
const AuthRoute = require('./routes/AuthRoute');
require('dotenv').config();
const SessionsRoute = require('./routes/SessionsRoute')

console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('TREASURY_SECRET_KEY exists:', !!process.env.TREASURY_SECRET_KEY);
console.log('MINT_MONK_TOKEN:', process.env.MINT_MONK_TOKEN);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));



app.use('/auth', AuthRoute)

app.use('/sessions', SessionsRoute)

app.listen(5667, () => {
    console.log("Server is running on port 5667");
});     