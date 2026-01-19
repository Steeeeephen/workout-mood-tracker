import {prisma} from "../lib/prisma.js";

export const createUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const user = await prisma.user.create({
        data: { first_name, last_name, email, password }
    })
    res.status(201).json(user)
}

export const getUser = async (req, res) => {
    const userId = 2;
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    res.send(user)
}

export const updateCurrentUser = async (req, res) => {
    const userId = 2;
    const { first_name, last_name, email, password } = req.body;
    const user = await prisma.user.update({
        where: { id: userId},
        data:  first_name, last_name, email, password
    })
    res.status(200).json(user)
}

