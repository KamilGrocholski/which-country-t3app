import { NextPage } from "next"
import { trpc } from "../utils/trpc"


const VotesResult: NextPage = () => {
    const { data: countries } = trpc.useQuery(['countries.get-all-orderBy-votesFor'], {
        refetchOnWindowFocus: false,
        refetchInterval: false
    })

    return (
        <div className='overflow-y-scroll h-[70vh] p-3'>
            {countries && countries.map((c, i) => (
                <div 
                    key={ i }
                    className='grid grid-cols-5 gap-3'
                >
                    <div>
                        {/* <Image 
                            src={ `https://countryflagsapi.com/png/${ c.iso2 }` }
                            alt={ 'flaga' }
                            width={ 32 }
                            height={ 12 }
                            layout='fixed'
                        /> */}
                    </div>
                    <div>{ c.name }</div>
                    <div>Głosów: { c._count.votesFor + c._count.votesAgainst }</div>
                    <div className='text-green-500'>Za: { c._count.votesFor }</div>
                    <div className='text-red-500'>Przeciw: { c._count.votesAgainst }</div>
                </div>
            ))}
        </div>
    )
}

export default VotesResult