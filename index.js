const express = require('express');
const app = express();
const z = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./db');
const auth = require('./auth');
const mongoose = require("mongoose");
mongoose.connect("Figure out how to connect to mongodb");
const secretkey = 'i dont want to use this in real, use a secure key instead';



const signuptemplate = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    info: z.any().optional() 
});



function zodChk(req,res,next) {
    const result = signuptemplate.safeParse(req.body);

    if (!result.success) {  
        return res.status(400).json({ error: result.error.issues[0].message });
    }
    req.passedData = result.data; // store the parsed data in req for further use
    next();
}



app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Locker Room');
});


app.post('/signup', zodChk, async (req, res) => {

    const { username, password,info } = req.passedData;
    const hashedPassword = await bcrypt.hash(password, 6);
    try {
    await UserModel.create({
        username: username,
        password :hashedPassword,
        info: info
    });
        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/signin', zodChk, async (req, res) => {
    
    const { username, password } = req.passedData;

    const user = await UserModel.findOne({
        username: username,
    });

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({
        id : user._id.toString(),
    }, secretkey);

    res.status(200).json({ token }); 

});

app.get('/me', auth, async (req, res) => {
    
    const user = await UserModel.findById(req.id);     

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    if (!user.info) {
        return res.status(404).send('No info available for this user');
    }

    res.status(200).json({info: user.info });

});

app.listen(3000);