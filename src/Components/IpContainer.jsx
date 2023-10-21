import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import useFetch from '../utils/useFetch'
import 'leaflet/dist/leaflet.css'
import TextLoader from '../Presentational/TextLoader'
import Loader from '../Presentational/Loader'
import { iconPerson } from '../Presentational/IconMap'

//https://geo.ipify.org/api/v2/country,city?apiKey=at_tNbXnDhaxLVilnNgOpDhbwP3kyXpH&ipAddress=
//apify.example.json?ipAddress=

export default function IpContainer() {

    const [ipAddress, setIpAddress] = useState('')
    const [mustFetch, setMustFetch] = useState(1)

    const greenOptions = { color: 'green', fillColor: 'green' }

    const handleSubmit = (e) => {
        e.preventDefault()
        setMustFetch((prev) => prev + 1)
    }

    const { loading, data } = useFetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_tNbXnDhaxLVilnNgOpDhbwP3kyXpH&ipAddress=${ipAddress}`, [mustFetch])

    return (
        <>
            <div className='bg-[url("../../images/pattern-bg-desktop.png")] w-full h-64 md:h-52 bg-cover flex flex-col items-center font-mono px-5'>
                <h1 className='text-2xl sm:text-3xl font-semibold text-white mt-6 text-center'>
                    IP Address Tracker
                </h1>

                <form onSubmit={handleSubmit} className='w-full sm:w-2/3 lg:w-2/5 rounded-md flex mt-5'>
                    <input 
                        type='text' 
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        className='flex-grow py-3 px-5 rounded-l-lg' 
                        placeholder='Search for any IP address or domain' 
                    />
                    <button type='submit' className={`text-white px-4 rounded-r-lg ${ipAddress.length < 7 || ipAddress.length > 15 ? 'bg-gray-600' : 'bg-black'}`} disabled={ipAddress.length < 7 || ipAddress.length > 15}>
                        &gt;
                    </button>
                </form>

                <span 
                    className={`text-slate-400 underline cursor-pointer ${mustFetch < 2 && 'opacity-0'}`}
                    onClick={() => {
                        setIpAddress('')
                        setMustFetch((prev) => prev + 1)
                    }}    
                >
                    get current position
                </span>

                <div className='bg-[#f7f5f5] w-full lg:w-4/6  rounded-lg shadow-2xl mx-5 flex flex-col md:flex-row text-center md:text-start p-2 break-words' style={{zIndex: 999}}>
                    <div className='pt-2 md:pt-5 px-5 md:w-1/4'>
                        <h3 className='font-bold text-gray-500 text-xs'>IP ADDRESS</h3>
                        <span className='font-semibold text-lg'>
                            { loading || !data.hasOwnProperty('ip') ? <TextLoader /> : data.ip }
                        </span>
                    </div>
                    <div className='pt-2 md:pt-5 px-5 md:w-1/4 md:border-l-2'>
                        <h3 className='font-bold text-gray-500 text-xs'>LOCATION</h3>
                        <span className='font-semibold text-lg'>
                            { loading || !data.hasOwnProperty('location') ? <TextLoader /> : `${data.location.city}, ${data.location.region} ${data.as.asn}` }
                        </span>
                    </div>
                    <div className='pt-2 md:pt-5  px-5 md:w-1/4 md:border-l-2'>
                        <h3 className='font-bold text-gray-500 text-xs'>TIMEZONE</h3>
                        <span className='font-semibold text-lg'>
                            { loading || !data.hasOwnProperty('location') ? <TextLoader /> : `UTC${data.location.timezone}` }
                        </span>
                    </div>
                    <div className='py-2 md:py-5  px-5 md:w-1/4 md:border-l-2'>
                        <h3 className='font-bold text-gray-500 text-xs'>ISP</h3>
                        <span className='font-semibold text-lg'>
                            { loading || !data.hasOwnProperty('isp') ? <TextLoader /> : data.isp }
                        </span>
                    </div>
                </div>
            </div>
            { loading || !data.hasOwnProperty('location') ?
                <div className='bg-slate-200 w-full relative flex justify-center items-center text-4xl' style={{height: '80vh'}}>
                    <Loader />
                </div>
            :
            <MapContainer center={[data.location.lat, data.location.lng]} zoom={16} scrollWheelZoom={false} style={{ minHeight: '100vh' , width: '100%', zIndex: 998, position: 'absolute' }}>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker 
                    position={[data.location.lat, data.location.lng]}
                    icon={iconPerson}    
                >
                    <Popup>
                        Domain: {data.as.domain} <br /> Name: {data.as.name} <br /> Route: {data.as.route}
                    </Popup>
                </Marker>

                <Circle
                    center={[data.location.lat, data.location.lng]}
                    pathOptions={greenOptions}
                    radius={500}
                />

            </MapContainer>
            }
        </>
    )
}
