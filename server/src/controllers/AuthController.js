import {prisma} from "../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const saltRounds = 10;

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {

        // Checking if user already exists.
        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser){
            return res.status(400).json({ message: "User already exists." })
        }

        // Hash the password with bcrypt.
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with field data, and hashed password.
        const user = await prisma.user.create({
            data: {first_name, last_name, email, password: hashedPassword}
        })

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            message: "User registered successfully",
            token: token,
            userId: user.id,
            email: user.email,
            first_name: user.first_name

        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error registering user" });
    }

}


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password w/hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        // Send response with token
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const logoutUser = (req, res) => {
    // For JWT stored in localStorage (client-side):
    // The client just deletes the token from localStorage
    // Server doesn't need to do anything

    res.status(200).json({ message: "Logout successful" });
};

