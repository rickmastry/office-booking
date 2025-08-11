import React from 'react'
import Hero from '../components/Hero'
import FeaturedOffice from '../components/FeaturedOffice'
import ExclusiveOffer from '../components/ExclusiveOffer'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedOffice />
            <ExclusiveOffer />
            <Testimonial />
            <NewsLetter />
        </>
    )
}

export default Home
