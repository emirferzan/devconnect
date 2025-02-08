require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');


const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';


app.get('/', (req, res) => {
    res.send('DevConnect API is running...');
});


// Register User
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
        res.status(201).json({ message: "User registered", user });
    } catch (error) {
        // Handle specific error for unique constraint violation
        if (error.code === 'P2002') {
            // Unique constraint violation (e.g., email already exists)
            return res.status(409).json({ error: "User already exists with this email" });
        }
        // Generic error handling
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
