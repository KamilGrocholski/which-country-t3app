const getFlagURL = (iso2: string) => {
    return `${ process.env.NEXT_PUBLIC_FLAGS_API_URL }/png/${ iso2 }`
}

export default getFlagURL
