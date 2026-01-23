import {prisma} from "../lib/prisma.js";

export const createUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const user = await prisma.user.create({
        data: { first_name, last_name, email, password }
    })
    res.status(201).json(user)
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: BigInt(req.user.userId) },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true
                // Don't include password!
            }
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
};

export const updateCurrentUser = async (req, res) => {
    const userId = 2;
    const { first_name, last_name, email, password } = req.body;
    const user = await prisma.user.update({
        where: { id: userId},
        data:  first_name, last_name, email, password
    })
    res.status(200).json(user)
}

