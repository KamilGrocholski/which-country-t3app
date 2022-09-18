import { NextPage } from "next";
import Image from "next/image";
import getFlagURL from "../utils/getFlagURL";
import { trpc } from "../utils/trpc";

const MyVotes: NextPage = () => {

    const { data: user } = trpc.useQuery(['me.get-the-most-recent'])

    return (
        <div className='overflow-y-scroll max-h-[70vh]'>
            {user &&
            <div>
                {user.votes && 
                user.votes.map((v, i) => (
                    <div 
                        key={ i }
                        className='grid grid-cols-3 gap-5 items-center justify-center bg-dark-medium p-3 mb-3'
                    >
                        <CountryWindowCompare 
                            iso2={ v.votedFor.iso2 }
                            name={ v.votedFor.name }
                            cssText={ 'border border-green-500' }
                        />
                        <div className='text-xl font-semibold italic text-center'>
                            VS
                        </div>
                        <CountryWindowCompare 
                            iso2={ v.votedAgainst.iso2 }
                            name={ v.votedAgainst.name }
                            cssText={ 'border border-red-500' }
                        />
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default MyVotes

interface ICountryWindowComparePROPS {
    iso2: string
    name: string
    cssText: string
}
const CountryWindowCompare: React.FC<ICountryWindowComparePROPS> = (props) => {
    return (
        <div 
            key={ props.iso2 }
            className={ `flex flex-col space-y-3 items-center justify-center p-3 ${ props.cssText }` }
        >
            <div>
                <Image
                    src={ getFlagURL(props.iso2, 'w320') }
                    alt={ 'flaga' }
                    width={ 88 }
                    height={ 54 }
                    layout='fixed'
                    priority
                /> 
            </div>
            <div>{ props.name }</div>
        </div>
    )
}
