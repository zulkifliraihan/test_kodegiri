import express from 'express';

import RouteGroup from 'express-route-grouping';

// ---- START : SECTION USER -------
import UserRepository from '../app/repository/UserRepository/UserRepository';
import UserService from '../app/services/UserService';
import UserController from '../app/controllers/UserController';
import AuthController from '../app/controllers/AuthController';
import AuthService from '../app/services/AuthService';
import JWTMiddleware from '../app/middlewares/JWTMiddleware';
import RoleService from '../app/services/RoleService';
import RoleController from '../app/controllers/RoleController';
import RoleRepository from '../app/repository/RoleRepository/RoleRepository';
import RoleMiddleware from '../app/middlewares/RoleMiddleware';
import ProfileRepository from '../app/repository/ProfileRepository/ProfileRepository';
import BookRepository from '../app/repository/BookRepository/BookRepository';
import BookService from '../app/services/BookService';
import BookController from '../app/controllers/BookController';
import PublicService from '../app/services/PublicService';
import PublicController from '../app/controllers/PublicController';
import UserHasBookRepository from '../app/repository/UserHasBookRepository/UserHasBookRepository';

// ---- END : SECTION USER -------

const route = express.Router()



// START : PROFILE -  CONTROLLER, SERVICE, REPOSITORY
const profileRepository = new ProfileRepository()
// END : PROFILE -  CONTROLLER, SERVICE, REPOSITORY 

// START : USER -  CONTROLLER, SERVICE, REPOSITORY 
const userRepository = new UserRepository()
const userService = new UserService(userRepository, profileRepository)
const userController = new UserController(userService)
// END : USER -  CONTROLLER, SERVICE, REPOSITORY 

// START : ROLE -  CONTROLLER, SERVICE, REPOSITORY 
const roleRepository = new RoleRepository()
const roleService = new RoleService(roleRepository)
const roleController = new RoleController(roleService)
// END : ROLE -  CONTROLLER, SERVICE, REPOSITORY 

// START : BOOK -  CONTROLLER, SERVICE, REPOSITORY 
const bookRepository = new BookRepository()
const bookService = new BookService(bookRepository)
const bookController = new BookController(bookService)
// END : BOOK -  CONTROLLER, SERVICE, REPOSITORY 

// START : AUTHENTICATION -  CONTROLLER, SERVICE, REPOSITORY 
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)
// END : AUTHENTICATION -  CONTROLLER, SERVICE, REPOSITORY 

// START : USER HAS BOOK -  CONTROLLER, SERVICE, REPOSITORY 
const userHasBookRepository = new UserHasBookRepository()
// END : USER HAS BOOK -  CONTROLLER, SERVICE, REPOSITORY
 
// START : PUBLIC -  CONTROLLER, SERVICE, REPOSITORY 
const publicService = new PublicService(userRepository, bookRepository, userHasBookRepository)
const publicController = new PublicController(publicService)
// END : PUBLIC -  CONTROLLER, SERVICE, REPOSITORY 


const publicApi = new RouteGroup('/public', route)
publicApi.group('/', pbc => {
    pbc.put('update-profile', JWTMiddleware, RoleMiddleware('public'), publicController.updateProfile.bind(publicController))
    pbc.post('rent-book', JWTMiddleware, RoleMiddleware('public'), publicController.rentBook.bind(publicController))
})

const authentication = new RouteGroup('/authentication', route)
authentication.group('/', auth => {
    auth.post('/', authController.authentication.bind(authController))
})


const users = new RouteGroup('/users', route)
users.group('/',user => {

    user.get('/', JWTMiddleware, RoleMiddleware('admin'), userController.getData.bind(userController))
    user.post('/', JWTMiddleware, RoleMiddleware('admin'), userController.createData.bind(userController))
    user.get('/:id', JWTMiddleware, RoleMiddleware('admin'), userController.detailData.bind(userController))
    user.put('/:id', JWTMiddleware, RoleMiddleware('admin'), userController.updateData.bind(userController))
    user.delete('/:id', JWTMiddleware, RoleMiddleware('admin'), userController.deleteData.bind(userController))

})

const roles = new RouteGroup('/roles', route)
roles.group('/',role => {
    role.get('/', JWTMiddleware, RoleMiddleware('admin'), roleController.getData.bind(roleController))
    role.post('/', JWTMiddleware, RoleMiddleware('admin'), roleController.createData.bind(roleController))
    role.get('/:id', JWTMiddleware, RoleMiddleware('admin'), roleController.detailData.bind(roleController))
    role.put('/:id', JWTMiddleware, RoleMiddleware('admin'), roleController.updateData.bind(roleController))
    role.delete('/:id', JWTMiddleware, RoleMiddleware('admin'), roleController.deleteData.bind(roleController))
})

const books = new RouteGroup('/books', route)
books.group('/',role => {

    role.get('/', JWTMiddleware, RoleMiddleware('admin'), bookController.getData.bind(bookController))
    role.post('/', JWTMiddleware, RoleMiddleware('admin'), bookController.createData.bind(bookController))
    role.get('/:id', JWTMiddleware, RoleMiddleware('admin'), bookController.detailData.bind(bookController))
    role.put('/:id', JWTMiddleware, RoleMiddleware('admin'), bookController.updateData.bind(bookController))
    role.delete('/:id', JWTMiddleware, RoleMiddleware('admin'), bookController.deleteData.bind(bookController))

})

export default route
