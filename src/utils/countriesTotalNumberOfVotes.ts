import { CountryAsyncReturnType } from "../pages/votes-results"

const countriesTotalNumberOfVotes = (countryVotes: CountryAsyncReturnType): number => {
    const numberOfVotes = countryVotes.reduce((acc, cur) => (
        acc + cur._count.votesFor
    ), 0)
    console.log(numberOfVotes)
    return numberOfVotes
}

export default countriesTotalNumberOfVotes
