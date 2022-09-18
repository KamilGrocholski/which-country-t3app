import { CountryAsyncReturnType } from "../pages/votes-results"

const countryVotesPercentage = (countryVotes: CountryAsyncReturnType[number]['_count'], base?: 'for' | 'against') => {
    const { votesFor, votesAgainst } = countryVotes
    const votesSum = votesFor + votesAgainst
    if (votesSum === 0) return 0
    if (base === 'for') return (votesFor / votesSum) * 100
    if (base === 'against') return (votesAgainst / votesSum) * 100
    return (votesFor / votesSum) * 100
}

export default countryVotesPercentage
