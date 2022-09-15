import getRandomIntInclusive from "./getRandomIntInclusive"

export const getRandomCountryId: (l: number, u: number, notThisOne?: number) => number = (l, u, notThisOne): number => {
    const countryId = getRandomIntInclusive(l, u)
  
    if (countryId !== notThisOne) return countryId 
    return getRandomCountryId(l, u, notThisOne)
}
  
export const getTwoRandomCountriesId = (l: number, u: number): [number, number] => {
    const firstId = getRandomCountryId(l, u)
    const secondId = getRandomCountryId(l, u, firstId)
  
    return [firstId, secondId]
}

export default getTwoRandomCountriesId