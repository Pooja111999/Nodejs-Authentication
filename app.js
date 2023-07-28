
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
JWT_SECRET_KEY = "xdgvjklfcvk";
dotenv.config();

const app = express();
const port = 7000;
//const port = process.env.PORT;
const db = require('./config/connectdb');
const userRoutes = require('./routes/userRoutes');

app.use(cors());

app.use(express.json());


app.use("/api/user",userRoutes);



app.listen(port, () =>{
    console.log(`server listening at http://localhost:${port}`)
})