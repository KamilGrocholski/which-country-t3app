import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { ForwardedRef, forwardRef, useRef, useState } from "react";
import getFlagURL from "../utils/getFlagURL";
import { inferQueryOutput, trpc } from "../utils/trpc";


const Home: NextPage = () => {

  const { data: session } = useSession()

  const [isDisabled, setIsDisable] = useState<boolean>(false)
  const firstCountryRef = useRef<HTMLButtonElement>(null)
  const secondCountryRef = useRef<HTMLButtonElement>(null)

  const { data: countriesPair, refetch } = trpc.useQuery(['countries.get-country-pair'])

  const addClassToBtns = () => {
    firstCountryRef.current?.classList.add('translate-x-[-200%]', 'opacity-0')
    secondCountryRef.current?.classList.add('translate-x-[200%]', 'opacity-0')
  }

  const addBorderColorsToBtns = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idFirst = firstCountryRef?.current?.id
    if (e.currentTarget)
    if (e.currentTarget.id === idFirst) {
      firstCountryRef.current?.classList.add('border', 'border-green-500')
      secondCountryRef.current?.classList.add('border', 'border-red-500')
    } else {      
      firstCountryRef.current?.classList.add('border', 'border-red-500')
      secondCountryRef.current?.classList.add('border', 'border-green-500')
    }
  }

  const { mutate } = trpc.useMutation([session?.user?.id ? 'me.cast-vote' : 'vote.cast'], { 
    onSuccess() {
      addClassToBtns()
      refetch()
    }
  })
  
  const handleVote = (e: React.MouseEvent<HTMLButtonElement>, votedFor?: number, votedAgainst?: number) => {
    if (!countriesPair || !votedFor || !votedAgainst) return 
    setIsDisable(true)
    addBorderColorsToBtns(e)
    mutate({ votedFor, votedAgainst })
    setIsDisable(false)
  }

  return (
    <>
      <div className='flex flex-row space-x-[20%] items-center justify-center'>
        {countriesPair?.firstCountry && countriesPair?.secondCountry &&
        <>
          <CountryWindow 
            country={ countriesPair.firstCountry }
            handleVote={ (e) => handleVote(e, countriesPair.firstCountry?.id, countriesPair.secondCountry?.id) }
            disabled={ isDisabled }  
            cssText={ 'animate-slideInFromLeft' }
            ref={ firstCountryRef }
          />
          <div className='font-semibold text-2xl italic'>
            VS
          </div>
          <CountryWindow
            country={ countriesPair.secondCountry }
            handleVote={ (e) => handleVote(e, countriesPair.secondCountry?.id, countriesPair.firstCountry?.id) }
            disabled={ isDisabled }  
            cssText={ 'animate-slideInFromRight' }
            ref={ secondCountryRef } 
          />
        </>}
      </div>
    </>
  );
};


type TCountry = NonNullable<inferQueryOutput<'countries.get-country-pair'>['firstCountry']>
interface ICountryWindowPROPS {
  country: TCountry
  handleVote: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  cssText?: string
}
// eslint-disable-next-line react/display-name
const CountryWindow = forwardRef((props: ICountryWindowPROPS, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <button
      id={ props.country.id.toString() }
      ref={ ref }
      key={ props.country.id }
      onClick={ props.handleVote } 
      disabled={ props.disabled }
      className={ 
        `flex flex-col space-y-5 items-center justify-center p-12 bg-dark-medium drop-shadow-lg shadow-lg shadow-black transition-all ease-in-out opacity-1 duration-1000 hover:scale-110 hover:-translate-y-4
        ${ props.cssText }
        ` 
      }
    > 
      <Image
        src={ getFlagURL(props.country.iso2, 'w320') }
        alt={ 'flag' }
        width={ 220 }
        height={ 120 }
        layout='fixed'
        priority
      />
      <div className='text text-center font-semibold text-lg'>
        { props.country.name }
      </div>
    </button>
  )
})

export default Home



