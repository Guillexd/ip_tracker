
export const getPosition = async(api) => {
    return await fetch(api)
    .then(value => value.json())
    .then(data => data)
    .catch(err => console.log(err))
}

export const getIpAddress = (url) => {
    const urlParams = new URLSearchParams(url)
    const ip = urlParams.get('ipAddress')
    return ip
}