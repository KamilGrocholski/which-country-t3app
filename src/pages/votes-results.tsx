import { prisma } from "../server/db/client"
import getFlagURL from "../utils/getFlagURL";
import Image from "next/image";
import AsyncReturnType from "../types/AsyncReturnType";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import countriesSorted from "../utils/countriesSorted";
import countryVotesPercentage from "../utils/countryVotesPercentage";
import countriesTotalNumberOfVotes from "../utils/countriesTotalNumberOfVotes";

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

    const [date, ] = useState<Date>(new Date(dataFetchedAt))

    return (
        <div className='flex flex-col space-y-3'>
            <CountryGeneralInfoSection>
                <CountryGeneralInfoWindow label={ 'Data ostatniej aktualizacji' } value={ date?.toLocaleString('pl-PL') } />
                <CountryGeneralInfoWindow label={ 'Całkowita ilość głosów' } value={ countriesTotalNumberOfVotes(countries) } />
                <CountryGeneralInfoWindow label={ 'Ilość państw' } value={ countries.length } />
            </CountryGeneralInfoSection>
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

const CountryGeneralInfoSection: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
    return (
        <section className='flex flex-row justify-start space-x-3 items-center'>   
            { children }
        </section>
    )
}

const CountryGeneralInfoWindow: React.FC<{ label: string, value: string | number }> = ({ label, value }) => {
    return (
        <div className='flex flex-col space-y-1 px-3 py-1 font-semibold bg-dark-light border border-dark-medium'>
            <div className=''>
                { value }
            </div>
            <div className='text-muted text-right'>
                { label }
            </div>
        </div>
    )
}

const CountryTableHead: React.FC = () => {
    return (
        <div className='grid grid-cols-4 py-1 font-semibold border border-dark-medium bg-dark-light '>
            <div className='flex flex-row space-x-3'>
                <div className='w-8 pl-3'>#</div>
                <div>Państwo</div>
            </div>
            <div>Liczba głosów</div>
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
                        src={ getFlagURL(props.iso2) }
                        alt={ 'flaga' }
                        width={ 32 }
                        height={ 14 }
                        layout='fixed'
                        priority
                    />
                </div>
                <div>{ props.name }</div>
            </div>
            <div>{ props._count.votesFor + props._count.votesAgainst }</div>
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