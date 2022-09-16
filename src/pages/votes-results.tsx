import { prisma } from "../server/db/client"
import getFlagURL from "../utils/getFlagURL";
import Image from "next/image";
import AsyncReturnType from "../types/AsyncReturnType";
import { GetServerSideProps, NextPage } from "next";

type CountryAsyncReturnType = AsyncReturnType<typeof getCountriesWithVotesStats>

const getCountriesWithVotesStats = async () => {
    const res = await prisma.country.findMany({
        orderBy: {
            votesFor: { _count: 'desc' }
          },
          select: {
            id: true,   
            name: true,
            iso2: true,
            _count: {
              select: {
                  votesFor: true,
                  votesAgainst: true
              }
            }
          }
    })

    return res
}

const VotesResult: NextPage<{ countries: CountryAsyncReturnType }> = ({ countries }) => {

    return (
        <div className='flex flex-col space-y-3'>
            <CountryTableHead />
            <div className='overflow-y-scroll h-[70vh] p-3'>
                {countries && countries.map((c, i) => (
                    <CountryRow 
                        key={ i }
                        { ...c }
                    />
                ))}
            </div>
        </div>
    )
}

export default VotesResult

const CountryTableHead: React.FC = () => {
    return (
        <div className='grid grid-cols-4 px-3 py-1 font-semibold border border-dark-medium bg-dark-light '>
            <div>Państwo</div>
            <div>Całkowita liczba głosów</div>
            <div>Głosy za</div>
            <div>Głosy przeciw</div>
        </div>
    )
}

const CountryRow: React.FC<CountryAsyncReturnType[0]> = (props) => {
    return (
        <div className='grid grid-cols-4 gap-3 border-b border-dark-medium hover:bg-dark-light'>
            <div className='flex flex-row space-x-3'>
                <div>
                    <Image 
                        src={ getFlagURL('png', props.iso2) }
                        alt={ 'flaga' }
                        width={ 32 }
                        height={ 14 }
                        layout='fixed'
                        priority
                    />
                </div>
                <div>{ props.name }</div>
            </div>
            <div>Głosów: { props._count.votesFor + props._count.votesAgainst }</div>
            <div className='text-green-500'>Za: { props._count.votesFor }</div>
            <div className='text-red-500'>Przeciw: { props._count.votesAgainst }</div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const countries = await getCountriesWithVotesStats()

    return {
        props: {
            countries
        }
    }
}