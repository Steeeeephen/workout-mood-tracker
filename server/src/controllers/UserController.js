import {prisma} from "../lib/prisma.js";

export const createUser = async (req, res) => {
    const user = await prisma.user.create({
        data: req.body
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

    const user = await prisma.user.update({
        where: { id: userId},
        data: req.body
    })
    res.status(200).json(user)
}

