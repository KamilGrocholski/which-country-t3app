import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Logout from "../assets/svg/Logout"
import Login from "../assets/svg/Login"

const Nav = () => {

    const { data: session } = useSession()

    return (
        <nav className='fixed top-0 left-0 right-0 h-16 bg-dark-medium flex flex-row px-3 items-center font-semibold text-sm text-white/50'>
            <div className='grow-0'>
                <Link
                    href='/'
                >
                    NazwaStrony
                </Link>
            </div>
            <div className='grow flex flex-row justify-end space-x-5'>
                <div className='flex felx-row space-x-5 items-center mr-10'>
                    <Link
                        href='/'
                    >
                        <div className='text-muted-hover cursor-pointer'>
                            Głosuj
                        </div>
                    </Link>
                    <Link
                        href='/votes-results'
                    >
                        <div className='text-muted-hover cursor-pointer'>
                            Wyniki głosowań
                        </div>
                    </Link>
                    {session?.user &&
                    <Link
                        href='/my-votes'
                    >
                        <div className='text-muted-hover cursor-pointer'>
                            Twoje głosy
                        </div>
                    </Link>}
                </div>
                {session?.user ?
                <>
                    <div
                        className='flex flex-row space-x-3 items-center bg-blue-500/10 px-3 py-1'
                    >
                        <div className='rounded-full w-8 h-8 overflow-hidden'>
                            {session.user.image &&
                            <Image 
                            src={ session.user.image }
                            alt={ session.user.image }
                            width={ 32 }
                            height={ 32 }
                            layout='responsive'
                            />}
                        </div>
                        <div>
                            {session.user.name &&
                            <div>
                                { session.user.name }
                            </div>}
                        </div>
                    </div> 
                    <button
                        onClick={ () => signOut() }
                    >
                        <Logout />
                    </button>
                </>:
                <button 
                    onClick={ () => signIn('discord') }
                    className='flex flex-row space-x-3 items-center px-3 py-1 bg-blue-500/20'
                >
                    <div>Zaloguj</div>  
                    <div><Login /></div>  
                </button>}
            </div>
        </nav>
    )
}

const Main = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { status } = useSession()
    return (
        <main className='h-screen w-screen flex justify-center items-center overflow-y-hidden overflow-x-hidden pt-[76px]'>
            {status === 'loading' ?
            <div>Ładowanie...</div> :
            <>{ children }</>}
        </main>
    )
}

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <>
            <Nav />
            <Main>
                { children }
            </Main>
        </>
    )
}

export default Layout 