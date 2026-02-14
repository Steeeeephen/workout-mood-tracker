import {prisma} from "../lib/prisma.js";

export const createEntry = async (req, res) => {
    try {
        const entry = await prisma.entry.create({
            data: {
                ...req.body,
                user_id: req.userId
            }
        })
        res.status(201).json(entry)
    } catch (err){
        console.error('Controller error:', err)
        res.status(500).json({
            error: 'Failed to post data',
            message: err.message
        })
    }
}

export const getEntriesByDate = async (req, res) => {
    try {
        const userId = req.userId;
        const {date} = req.params

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
            orderBy: {created_at: 'asc'}
        })

        res.status(200).json(entries)
    } catch (err) {
        console.error('Error in controller:', err)
        res.status.json({
            error: 'Failed to fetch data',
            message: err.message
        })
    }
}

export const getEntries = async (req, res) => {
    try {
        const userId = req.userId;

        const entries = await prisma.entry.findMany({
            where: {
                user_id: userId
            }
        })
        res.status(200).json(entries)
    } catch (err) {
        console.error('Error in controller:', err)
        res.status.json({
            error: 'Failed to fetch data',
            message: err.message
        })
    }
}

export const getEntry = async (req, res) => {
    try {
        const userId = req.userId;
        const entryId = parseInt(req.params.id);

        // Validate it's a valid number
        if (isNaN(entryId)) {
            return res.status(400).json({error: 'Invalid entry ID'});
        }

        const entry = await prisma.entry.findFirst({
            where: {
                id: entryId,
                user_id: userId
            }
        })

        // Handle not found case
        if (!entry) {
            return res.status(404).json({error: 'Entry not found'});
        }

        res.status(200).json(entry)
    } catch (err) {
        console.error('Error in controller:', err);
        res.status(500).json({
            error: 'Error fetching data',
            message: err.message
        })
    }
}


export const updateEntry = async (req, res) => {
    try {
        const userId = req.userId;
        const entryId = parseInt(req.params.id);

        // Validate it's a valid number
        if (isNaN(entryId)) {
            return res.status(400).json({error: 'Invalid entry ID'});
        }

        const entry = await prisma.entry.update({
            where: {
                id: entryId,
                user_id: userId
            },
            data: req.body
        })

        res.status(200).json(entry);
    } catch (err) {
        console.error('Error in controller', err);
        res.status(500).json({
            error: 'Error updating data',
            message: err.message
        })
    }
}


export const deleteEntry = async(req, res) => {
    try {
        const userId = req.userId;
        const entryId = parseInt(req.params.id);

        // Validate it's a valid number
        if (isNaN(entryId)) {
            return res.status(400).json({error: 'Invalid entry ID'});
        }

        const entry = await prisma.entry.findFirst({
            where: {
                id: entryId,
                user_id: userId
            }
        });

        if (!entry) {
            return res.status(404).json({error: 'Entry not found'});
        }

        await prisma.entry.delete({
            where: {id: entryId}
        });

        res.status(204).send();
    } catch (err) {
        console.error('Error in controller', err);
        res.status(500).json({
            error: 'Error deleting data',
            message: err.message
        })
    }

}