import {prisma} from "../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const saltRounds = 10;

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {

        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser){
            return res.status(400).json({ message: "User already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {first_name, last_name, email, password: hashedPassword}
        })

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
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

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
  res.status(200).json({ message: "Logout successful" });
};

