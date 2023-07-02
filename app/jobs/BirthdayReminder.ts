import UserInterface from "../repository/UserRepository/UserInterface"
import axios from "axios"
import moment from 'moment-timezone';
import Queue from 'bull';
import { JobOptions } from 'bull';

class BirthdayReminder {

  constructor(private userRepository: UserInterface, private queue: Queue.Queue) {}

  public async main() {
    console.log("----- Birthday Reminder -----");

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
          }
        }
        else {
            console.log("Nothing to Reminder Birthday")
        }
      }
    }));
  }
}

export default BirthdayReminder;
