import moment from "moment";
import hashPassword from "../../app/helpers/SecurityHelper";
import prisma from "../../config/prisma";
import { faker } from '@faker-js/faker';


class UserSeeder {
    async seed() {
        try {
            
            for (let i = 0; i < 1000; i++) {
                const randomNumber = Math.floor(Math.random() * 150) + 1;
                const randomNumberRole = Math.floor(Math.random() * 2) + 1;
                const pastDate = faker.date.past();
                const formattedDate = moment(pastDate).format('YYYY-MM-DD');

                const data: any = {
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    profiles: {
                        create: {
                            country_id : randomNumber,
                            state_id : randomNumber,
                            city_id : randomNumber,
                            firstName: faker.name.firstName(),
                            lastName: faker.name.lastName(),
                            birthdayAt: faker.date.past().toISOString(),
                            timezone: faker.address.timeZone()
                        }
                    },
                };
            
                const user: any = await prisma.user.create({ data })

                const dataUserHasRole = {
                    data: {
                      user_id: user.id,
                      role_id: randomNumberRole,
                    },
                  };
                  
                const userHasRole = await prisma.userHasRole.create(dataUserHasRole);
                  
            }
            console.log(`✨ ---- Successfully Seed UserSeeder ---- ✨`)
        } catch (error: any) {
            console.log(`🔥 ---- Failed Seed UserSeeder ---- 🔥`)
            console.log(error.message)
        }

    }
}
export default new UserSeeder()
