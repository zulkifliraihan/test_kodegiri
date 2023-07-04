import Queue from 'bull';

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

queue.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed.`);
});

queue.on('failed', (job, error) => {
  console.error(`Job ${job.id} has failed: ${error.message}`);
});


export default queue;
