const express = require('express');
const app = express();

const users = [
    {
        username: 'dummy@gmail.com',
        password: 'dummy123'
    }
]
app.use(express.json());
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

app.get('/', (req, res) => {
  res.send('Welcome to Locker Room');
});


app.post('/signup', (req, res) => {
    const { username, password,info } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password , info });
    res.status(201).send('User created successfully');
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    const token = generateToken();
    user.token = token;
    res.status(200).json({ token });        
});

app.get('/me', (req, res) => {
    const token = req.headers.token;
    console.log(token);
    if (!token) {
        return res.status(401).send('Token missing');
    }
    const user = users.find(user => user.token === token);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    res.status(200).json({info: user.info });
});

app.listen(3000);