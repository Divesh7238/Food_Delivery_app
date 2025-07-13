import React from 'react';
import { aboutfeature } from '../../assets/dummydata';
import { FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AboutImage from '../../assets/AboutImage.png'; // <-- Your image file
import FloatingParticle from '../FloatingParticle/FloatingParticle';

const AboutHome = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1c0f0f] via-[#1a1212] to-[#2e1b1b] text-white py-10 sm:py-20 relative overflow-hidden'>

     
      <div className='absolute top-1/4 left-2 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl mix-blend-soft-light' />
      <div className='absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl mix-blend-soft-light' />


      <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:gap-8 xl:gap-16 relative'>

       
        <div className='w-full order-1 lg:order-2 space-y-8 sm:space-y-12 relative'>
          <div className='space-y-4 sm:space-y-8 px-4 sm:px-0'>
            <h2 className='text-3xl sm:text-4xl xl:text-5xl md:text-6xl font-bold leading-tight'>
              <span className='font-cursive text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent'>
                Taste the Artistry
              </span>
              <br />
              <span className='inline-block mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl opacity-90 font-light'>
                Where Every Flavor Tells a Story
              </span>
            </h2>

            <p className='text-base sm:text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl font-serif italic border-l-4 border-rose-500/60 pl-4 sm:pl-6 py-2 bg-gradient-to-r from-white/5 to-transparent'>
              "Each dish is a narrative — woven with passion, perfected by tradition, and served with soul. We don't just cook, we create experiences worth remembering."
            </p>
          </div>

         
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 px-4 sm:px-0'>
            {aboutfeature.map((item, i) => (
              <div key={i} className='flex flex-col items-center justify-center gap-3 sm:gap-4 transition-transform duration-300 p-4 sm:p-5 hover:translate-x-2'>
                <div className={`p-3 sm:p-4 rounded-full bg-gradient-to-br ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className='text-2xl sm:text-3xl text-white' />
                </div>
                <div className='text-center'>
                  <h3 className='text-xl sm:text-2xl font-bold font-cursive'>{item.title}</h3>
                  <p className='opacity-80 text-sm sm:text-base'>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

        
          <div className='flex flex-wrap gap-4 items-center mt-6 sm:mt-8 px-4 sm:px-0'>
            <Link
              to='/about'
              className='px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl font-bold hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-rose-500/20 group relative overflow-hidden'
            >
              <span className='absolute inset-0 bg-gradient-to-r from-rose-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <FaInfoCircle className='text-lg sm:text-xl animate-pulse' />
              <span className='font-cursive text-lg sm:text-xl'>Discover the Story</span>
            </Link>
          </div>
        </div>

       
        <div className='w-full order-2 lg:order-1 md:max-w-md lg:max-w-none lg:w-7/12 mt-12 md:mt-0 relative group transform hover:scale-[1.01] transition-all duration-500'>
          <div className='relative rounded-[4rem] overflow-hidden border-4 border-amber-400/30 hover:border-amber-500/50 shadow-2xl shadow-black/50'>
            <div className='absolute inset-0 bg-gradient-to-br from-amber-400/15 via-transparent to-amber-600/10' />
            <img
              src={AboutImage}
              alt="Restaurant"
              className='w-full h-auto object-cover aspect-[3/4] transform rotate-0 hover:rotate-1 transition-all duration-500'
            />
            
            <div className='absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-amber-900/30 blur-3xl -z-10' />
          </div>
          <div className='absolute -top-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl' />
        </div>

      </div>

     
      <FloatingParticle />
    </div>
  );
};

export default AboutHome;
