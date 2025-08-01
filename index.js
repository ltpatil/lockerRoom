const express = require('express');
const app = express();
const z = require('zod');
const jwt = require('jsonwebtoken');
const secretkey = 'i dont want to use this in real, use a secure key instead';

const signuptemplate = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    info: z.any().optional() 
});

const signintemplate = z.object({
    username: z.string().email(),
    password: z.string().min(6)
});



const users = [
    {
        username: 'dummy@gmail.com',
        password: 'dummy123'
    }
]

function zodChk(req,res,next) {
    const result = signuptemplate.safeParse(req.body);

    if (!result.success) {  
        // console.log(result.error.issues.message);
        return res.status(400).json({ error: result.error.issues[0].message });
    }
    req.passedData = result.data; // store the parsed data in req for further use
    next();
}

function auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).send('Token missing');
    }

    const decoded = jwt.verify(token, secretkey); 
    
    if(!decoded || !decoded.username) {
        return res.status(401).send('Invalid token');
    }
    req.username = decoded.username; // store the username in req for further use
    next();

}

app.use(express.json());

// Function to generate a random token ***depricated - use JWT instead***
// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
//         'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
//         'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
//         'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
//         'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

app.get('/', (req, res) => {
  res.send('Welcome to Locker Room');
});


app.post('/signup', zodChk, (req, res) => {

    const { username, password,info } = req.passedData;

    if (users.find(user => user.username === username)) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password , info });
    res.status(201).send('User created successfully');
});

app.post('/signin', zodChk, (req, res) => {
    
    const { username, password } = req.passedData;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({
        username: user.username
    }, secretkey);

    // user.token = token;  modified to use JWT instead of custom token

    res.status(200).json({ token }); 

});

app.get('/me', auth, (req, res) => {
    
    const user = users.find(user => user.username === req.username);

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    if (!user.info) {
        return res.status(404).send('No info available for this user');
    }

    res.status(200).json({info: user.info });
    
});

app.listen(3000);