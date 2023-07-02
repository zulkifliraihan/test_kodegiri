import express from 'express';

import RouteGroup from 'express-route-grouping';

// ---- START : SECTION LOCATION -------
import LocationRepository from '../app/repository/LocationRepository/LocationRepository';
import LocationService from '../app/services/LocationService';
import LocationController from '../app/controllers/LocationController';
// ---- END : SECTION LOCATION -------

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

// ---- END : SECTION USER -------

const route = express.Router()


// START : LOCATION -  CONTROLLER, SERVICE, REPOSITORY 
const locationRepository = new LocationRepository()
const locationService = new LocationService(locationRepository)
const locationController = new LocationController(locationService)

// END : LOCATION -  CONTROLLER, SERVICE, REPOSITORY 

// END : PROFILE -  CONTROLLER, SERVICE, REPOSITORY 
const profileRepository = new ProfileRepository()
// START : PROFILE -  CONTROLLER, SERVICE, REPOSITORY

// START : USER -  CONTROLLER, SERVICE, REPOSITORY 
const userRepository = new UserRepository()
const userService = new UserService(userRepository, profileRepository)
const userController = new UserController(userService)

// END : USER -  CONTROLLER, SERVICE, REPOSITORY 

// START : AUTHENTICATION -  CONTROLLER, SERVICE, REPOSITORY 
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)
// END : AUTHENTICATION -  CONTROLLER, SERVICE, REPOSITORY 


const publicApi = new RouteGroup('/public', route)
publicApi.group('/', pbc => {
    pbc.put('update-profile', JWTMiddleware, RoleMiddleware('public'), userController.updateForPublic.bind(userController))
})

const authentication = new RouteGroup('/authentication', route)
authentication.group('/', auth => {
    auth.post('/', authController.authentication.bind(authController))

})

const location = new RouteGroup('/location', route)
location.group('/', loc => {
    loc.get('/country', JWTMiddleware, RoleMiddleware('admin'), locationController.getDataCountry.bind(locationController))
    loc.get('/state', JWTMiddleware, RoleMiddleware('admin'), locationController.getDataState.bind(locationController))
    loc.get('/state/:countryId', JWTMiddleware, RoleMiddleware('admin'), locationController.getDataStateByCountryId.bind(locationController))
    loc.get('/city', JWTMiddleware, RoleMiddleware('admin'), locationController.getDataCity.bind(locationController))
    loc.get('/city/:stateId', JWTMiddleware, RoleMiddleware('admin'), locationController.getDataCityByStateId.bind(locationController))
    loc.get('/timezone/:countryId/', JWTMiddleware, RoleMiddleware('admin'), locationController.dataTimezoneByCountryId.bind(locationController))
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
    const roleRepository = new RoleRepository()
    const roleService = new RoleService(roleRepository)
    const roleController = new RoleController(roleService)

    role.get('/', JWTMiddleware, RoleMiddleware('admin'), roleController.getData.bind(roleController))
    role.post('/', JWTMiddleware, RoleMiddleware('admin'), roleController.createData.bind(roleController))
    role.get('/:id', JWTMiddleware, RoleMiddleware('admin'), roleController.detailData.bind(roleController))
    role.put('/:id', JWTMiddleware, RoleMiddleware('admin'), roleController.updateData.bind(roleController))
    role.delete('/:id', JWTMiddleware, RoleMiddleware('admin'), roleController.deleteData.bind(roleController))

})

export default route
