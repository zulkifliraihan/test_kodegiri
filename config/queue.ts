import Queue from 'bull';
import axios from 'axios';
import prisma from './prisma';

const queue = new Queue('birthdayQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential', 
      delay: 2000,
    },
  },
});

queue.process('send-email', async (job) => {
  const { email, message } = job.data;

  try {
    const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', { email, message });

    if (response.status == 200) {
      const user = await prisma.user.findUnique({ where: { email } })

      if (user) {
        user
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            profiles: {
              update: {
                lastReminderBirthdayAt: new Date()
              }
            },
          },
        });
      }
    }
    
  } catch (error: any) {
    if (job.attemptsMade < 3) {
      console.log('Scheduling retry for job');
      throw error; 
    } else {
      console.log('Max retries reached for job');
    }
    console.error('API error:', error.message);
  }
});

queue.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed.`);
});

queue.on('failed', (job, error) => {
  console.error(`Job ${job.id} has failed: ${error.message}`);
});


export default queue;
