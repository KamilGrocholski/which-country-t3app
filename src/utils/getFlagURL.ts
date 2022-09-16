const getFlagURL = (fileExtension: 'png' | 'svg' | 'jpg', iso2: string) => {
    return `${ process.env.NEXT_PUBLIC_FLAGS_API_URL }/${ fileExtension }/${ iso2 }`
}

export default getFlagURL
