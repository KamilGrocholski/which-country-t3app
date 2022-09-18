import { CountryAsyncReturnType } from "../pages/votes-results"
import countryVotesPercentage from "./countryVotesPercentage"

const countriesSorted = (countries?: CountryAsyncReturnType) => {
    if (!countries) return 
    return countries.sort((a, b) => {
        const dif = countryVotesPercentage(b._count, 'for') - countryVotesPercentage(a._count, 'for')
        if (dif === 0) return b._count.votesFor - a._count.votesFor
        return dif
    })
}

export default countriesSorted