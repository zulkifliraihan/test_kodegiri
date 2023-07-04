import axios from "axios";
import prisma from "../../config/prisma";
import { Queue } from "bull";

class birthdayQueue {
    async main(queue: Queue) {
        queue.process('send-email', async (job) => {
            console.log('\\--- START QUEUE SEND EMAIL ---/')
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
            console.log("\\--- END QUEUE SEND EMAIL ---/")

          });
    }
}

export default new birthdayQueue()
