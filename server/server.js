import express from 'express';
import {prisma} from './src/lib/prisma.js'
import usersRouter from './src/routes/usersRouter.js'
import entriesRouter from './src/routes/entriesRouter.js'
import authRouter from './src/routes/authRoutes.js'
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON can't handle bigint, apparently.
BigInt.prototype.toJSON = function() {
    return this.toString()
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/users', usersRouter)
app.use('/api/entries', entriesRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res)=>{
    res.send('WELCOME.')
});


process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
} )