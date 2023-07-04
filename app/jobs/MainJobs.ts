import cron from 'node-cron';
import UserRepository from '../repository/UserRepository/UserRepository';
import BirthdayReminder from './BirthdayReminder';

const userRepository = new UserRepository();

const MainJobs = () => {
  const birthdayReminder = new BirthdayReminder(userRepository);
  const birthdayScheduler = cron.schedule('* * * * *', birthdayReminder.main.bind(birthdayReminder));

  birthdayScheduler.start();
};

export default MainJobs;
