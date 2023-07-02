interface LocationInterface {
    dataCountry(include: {} | null): Promise<object[]>
    dataState(include: {} | null): Promise<object[]>
    dataCity(include: {} | null): Promise<object[]>
    dataStateByCountryId(countryId: number): Promise<object[]>
    dataCityByStateId(stateId: number): Promise<object[]>
    detailCountry(ID: number): Promise<any>
    detailState(ID: number): Promise<any>
    detailCity(ID: number): Promise<any>
}

export default LocationInterface