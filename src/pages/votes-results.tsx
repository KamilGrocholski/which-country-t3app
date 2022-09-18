import { prisma } from "../server/db/client"
import getFlagURL from "../utils/getFlagURL";
import Image from "next/image";
import AsyncReturnType from "../types/AsyncReturnType";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import countriesSorted from "../utils/countriesSorted";
import countryVotesPercentage from "../utils/countryVotesPercentage";

export type CountryAsyncReturnType = AsyncReturnType<typeof getCountriesWithVotesStats>

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

const VotesResult: NextPage<{ countries: CountryAsyncReturnType, dataFetchedAt: number }> = ({ countries, dataFetchedAt }) => {

    const [date, ] = useState<Date | null>(new Date(dataFetchedAt))

    return (
        <div className='flex flex-col space-y-3'>
            <div className='flex flex-col space-y-1 text-center'>
                <div className='text-muted'>Data ostatniej aktualizacji</div>
                <div>{ date?.toLocaleString('pl-PL') }</div>
            </div>
            <CountryTableHead />
            <div className='overflow-y-scroll h-[70vh]'>
                {countries && countriesSorted(countries)?.map((c, i) => (
                    <CountryRow 
                        key={ i }
                        { ...c }
                        place={ i + 1 }
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
            <div className='flex flex-row space-x-3'>
                <div className='w-8'>#</div>
                <div>Państwo</div>
            </div>
            <div>Całkowita liczba głosów</div>
            <div>Głosy za</div>
            <div>Głosy przeciw</div>
        </div>
    )
}

const CountryRow: React.FC<CountryAsyncReturnType[number] & { place: number }> = (props) => {
    return (
        <div className='grid grid-cols-4 gap-1 border-b border-dark-medium even:bg-dark-light'>
            <div className='flex flex-row space-x-3'>
                <div className='w-8 text-center'>
                    { props.place }
                </div>
                <div>
                    <Image 
                        src={ getFlagURL(props.iso2, 'w40') }
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
            <div className='text-green-500'>{ countryVotesPercentage(props._count, 'for').toFixed(2) + '%' }</div>
            <div className='text-red-500'>{ countryVotesPercentage(props._count, 'against').toFixed(2) + '%' }</div>
        </div>
    )
}

export const getStaticProps: GetServerSideProps = async () => {
    const countries = await getCountriesWithVotesStats()
    const dataFetchedAt = Date.now()

    const REVALIDATION_TIME = 5 * 60 * 60 // 5 hours

    return {
        props: {
            countries,
            dataFetchedAt
        },
        revalidate: REVALIDATION_TIME
    }
}