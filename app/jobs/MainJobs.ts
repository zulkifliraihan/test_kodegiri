import cron from 'node-cron';
import UserRepository from '../repository/UserRepository/UserRepository';
import BirthdayReminder from './BirthdayReminder';
import Queue from 'bull';

const userRepository = new UserRepository();

const MainJobs = (queue: Queue.Queue) => {
  const birthdayReminder = new BirthdayReminder(userRepository, queue);
  const birthdayScheduler = cron.schedule('* * * * *', birthdayReminder.main.bind(birthdayReminder));

  birthdayScheduler.start();
};

export default MainJobs;
