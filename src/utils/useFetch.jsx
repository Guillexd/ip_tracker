import { useState, useEffect } from 'react'
import { getIpAddress, getPosition } from './utils'

export default function useFetch(url, dependency = [null]) {

    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if(!!localStorage.getItem('position') && getIpAddress(url) === ''){
            const value = localStorage.getItem('position')
            const post = JSON.parse(value)
            setLoading(false)
            return setData(post)
        }
        getPosition(url)
        .then(value => {
            if(value.hasOwnProperty('location')) {
                localStorage.setItem('position', JSON.stringify(value))
                setLoading(false)
                setData(value)
            }
        })
    }, dependency)
    
    return { data, loading }
}
