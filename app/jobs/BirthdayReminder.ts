import UserInterface from "../repository/UserRepository/UserInterface"
import axios from "axios"
import moment from 'moment-timezone';
import { JobOptions } from 'bull';
import queue from "../../config/queue";

class BirthdayReminder {
  private queue: any

  constructor(private userRepository: UserInterface) {
    // const queueDeclare: any = Queue
    this.queue = queue
  }

  public async main() {
    console.log("----- Birthday Reminder -----");

    try {
      let statusReminder;
      let totalReminder: number = 0
      const users = await this.userRepository.getData();
      await Promise.all(users.map(async (value: any) => {
        const currentDate = moment().format('YYYY-MM-DD')
  
        let birthday = moment(value.profiles.birthdayAt);
        const lastReminderBirthdayAt = moment(value.profiles.lastReminderBirthdayAt).format('YYYY-MM-DD')
        const fullName = value.profiles.firstName + value.profiles.lastName;
        const email = value.email;
        const timezone = value.profiles.timezone;
        const localTimezone = moment.tz(timezone);
        if (localTimezone) {
          const isSameMonthAndDate = birthday.format('MM-DD') === localTimezone.format('MM-DD') && currentDate != lastReminderBirthdayAt;
          if (isSameMonthAndDate) {
            const hourSend = 9;
            const hourLocalTimezone = localTimezone.format('H');
            if (parseInt(hourLocalTimezone) == hourSend) {
              const message = `Hey, ${fullName} it's your birthday`;
              const body = {
                  email: email,
                  message: message
              };
              const jobOptions: JobOptions = {
                  attempts: 3,
                  backoff: {
                  type: 'exponential',
                  delay: 2000
                  }
              };
  
              await this.queue.add('send-email', body, jobOptions);

              statusReminder = true
              totalReminder += 1;
            }
          }
          else {
              statusReminder = false
          }
        }
      }));
  
      if (statusReminder) {
        console.log(`We have ${totalReminder == 1 ? totalReminder + `user` : totalReminder + 'users'} total to Reminder Birthday`)
      }
      else{
        console.log("Nothing to Reminder Birthday")
      }
      
    } catch (error: any) {
      console.log("ERROR -  Birthday Reminder")
      console.log(error.message)
    }
  }
}

export default BirthdayReminder;
