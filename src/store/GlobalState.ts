import create from 'zustand'

interface IGlobalState {
    isNavBig: boolean
    toggleIsNavBig: () => void 
    isTogglingDone: boolean
    setIsTogglingDone: (bool: boolean) => void
}

const useGlobalState = create<IGlobalState>(set => ({
    isNavBig: true,
    toggleIsNavBig: () => set(state => ({ isNavBig: !state.isNavBig })),
    isTogglingDone: true,
    setIsTogglingDone: (bool) => set(state=> ({ isTogglingDone: bool }))
}))

export default useGlobalState