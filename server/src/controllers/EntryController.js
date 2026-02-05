import {prisma} from "../lib/prisma.js";

export const createEntry = async (req, res) => {
    const entry = await prisma.entry.create({
        data: {
            ...req.body,
            user_id: req.userId
        }
    })
    res.status(201).json(entry)
}

export const getEntriesByDate = async (req, res) => {
    const userId = req.user.userId;
    const { date } = req.params

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');


    const entries = await prisma.entry.findMany({
        where: {
            user_id: userId,
            created_at: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        orderBy: { created_at: 'asc' }
    })

    res.status(200).json(entries)
}

export const getEntries = async (req, res) => {
    const userId = req.userId;

    const entries = await prisma.entry.findMany({
        where: {
            user_id: userId
        }
    })
    console.log('hi')
    res.status(200).json(entries)
}

export const getEntry = async (req, res) => {
    const userId = req.user.userId;
    const entryId = parseInt(req.params.id);

    // Validate it's a valid number
    if (isNaN(entryId)) {
        return res.status(400).json({ error: 'Invalid entry ID' });
    }

    const entry = await prisma.entry.findFirst({
        where: {
            id: entryId,
            user_id: userId
        }
    })

    // Handle not found case
    if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
    }

    res.status(200).json(entry)
}


export const updateEntry = async (req, res) => {
    const userId = req.user.userId;
    const entryId = parseInt(req.params.id);

    // Validate it's a valid number
    if (isNaN(entryId)) {
        return res.status(400).json({ error: 'Invalid entry ID' });
    }

    const entry = await prisma.entry.update({
        where: {
            id: entryId,
            user_id: userId
        },
        data: req.body
    })

    res.status(200).json(entry);
}


export const deleteEntry = async(req, res) => {
    const userId = req.user.userId;
    const entryId = parseInt(req.params.id);

    // Validate it's a valid number
    if (isNaN(entryId)) {
        return res.status(400).json({ error: 'Invalid entry ID' });
    }

    const entry = await prisma.entry.findFirst({
        where: {
            id: entryId,
            user_id: userId
        }
    });

    if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
    }

    await prisma.entry.delete({
        where: { id: entryId }
    });

    res.status(204).send();

}