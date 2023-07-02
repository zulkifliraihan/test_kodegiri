# Test - PT. Surya Digital Teknologi

## How to run
- Yarn Install
- Copy .env.example to .env
- Setup in file .env is :
    - APP_NAME (Portofolio - API EXPRESS JS)
    - APP_ENV (local/development/staging/production)
    - PORT = 3000
    - DATABASE_URL (EX : "mysql://root:@localhost:3306/personal_portofolio")
    - JWT_SECRET 
- Run "yarn seed --reset" (For migrate database and seeder)
- Run "yarn watch" (For running localtest)
- Import DB World from ./prisma/databases/world.sql
OR
- You can import my local db from ./prisma/databases/All - Databases.sql
