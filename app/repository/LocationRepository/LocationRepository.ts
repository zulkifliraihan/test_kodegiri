import prisma from '../../../config/prisma';
import LocationInterface from './LocationInterface';

class LocationRepository implements LocationInterface {

  async dataCountry(include: {} | null): Promise<object[]> {
    const result = await prisma.countries.findMany();
    return result;
  }

  async dataState(include: {} | null): Promise<object[]> {
    const result = await prisma.states.findMany();
    return result;
  }

  async dataCity(include: {} | null): Promise<object[]> {
    const result = await prisma.cities.findMany();
    return result;
  }

  async dataStateByCountryId(countryId: number): Promise<object[]> {
    const result = await prisma.states.findMany({
      where: {
        country_id: countryId
      }
    });
    
    return result;
  }

  async dataCityByStateId(stateId: number): Promise<object[]> {
    const result = await prisma.cities.findMany({
      where: {
        state_id: stateId
      }
    });

    return result;
  }

  async detailCountry(id: number): Promise<any>{
    const data = await prisma.countries.findUnique({
          where: {
              id
          }
      })
      
      return data
  }

  async detailState(id: number): Promise<any>{
    const data = await prisma.states.findUnique({
          where: {
              id
          }
      })
      
      return data
  }
  
  async detailCity(id: number): Promise<any>{
    const data = await prisma.cities.findUnique({
          where: {
              id
          }
      })
      
      return data
  }
}

export default LocationRepository;
