// import cron from 'node-cron';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import route from '../routes/api';
import bodyParser from 'body-parser';
import MainJobs from '../app/jobs/MainJobs';
import queue from '../config/queue';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { sessionConfig } from '../config/session';
import MainQueue from '../app/queues/MainQueue';


dotenv.config();
const app = express();
MainJobs();
MainQueue.main()

const JWTSecret: any = process.env.JWT_SECRET
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessionConfig);

const port = process.env.port || process.env.PORT || 3000
const appName = process.env.APP_NAME
const appEnv = process.env.APP_ENV


app.get('/', (req: Request, res: Response) => {
    res.send('Test - PT.Surya Digital Teknologi!');
});

app.use('/api', route)

const { router } = createBullBoard([new BullAdapter(queue)]); // Wrap the BullAdapter instance in an array

app.use('/admin/queues-dashboard', router);

app.listen(port, () => {
    console.log(`\n${ appName } (${appEnv}) listening to http://localhost:${ port }`)
})

