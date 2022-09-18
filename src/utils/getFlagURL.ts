const getFlagURL = (iso2: string, size:  'w20' | 'w40' | 'w80' | 'w160' | 'w320' | 'w640' | 'w1280' | 'w2560') => {
    return `${ process.env.NEXT_PUBLIC_FLAGS_API_URL }/${ size }/${ iso2.toLowerCase() }.jpg`
}

export default getFlagURL
