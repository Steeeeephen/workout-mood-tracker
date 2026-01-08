import express from 'express';
import {prisma} from './src/lib/prisma.js'


const app = express();
const PORT = 3000;


app.get('/', (req, res)=>{
    res.send('Hello')
})




process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
} )