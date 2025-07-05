import React, { useState } from 'react';
import { FaSearch, FaDownload, FaPlay, FaTimes } from 'react-icons/fa';
import { bannerAssets } from '../../assets/dummydata';

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const { bannerImage, orbitImages, video } = bannerAssets;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="relative">
      {/* Main Gradient Background */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-8 relative md:pr-8 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
              Delicious Food, Delivered Fast <br />
              <span className="text-amber-400 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Fresh. Fast. At Your Doorstep.
              </span>
            </h1>
            <p className="text-lg lg:text-xl font-playfair italic text-amber-100 max-w-xl opacity-90 mx-auto md:mx-0">
              Enjoy meals from top chefs and the fastest delivery teams. Hot, tasty food delivered to your door in under 60 minutes.
            </p>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto md:mx-0 group">
              <div className="relative flex items-center bg-amber-900/30 rounded-xl border-2 border-amber-500 shadow-xl hover:bg-amber-400/40 transition-all duration-300">
                <div className="pl-6 pr-3 py-4">
                  <FaSearch className="text-xl text-amber-400/80" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover your next favorite meal..."
                  className="w-full py-4 pr-6 bg-transparent outline-none placeholder-amber-200/70 text-lg font-medium tracking-wide"
                />
              </div>
            </form>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              <button className="group flex items-center gap-3 bg-amber-800/30 hover:bg-amber-700/50 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-amber-700/50 hover:border-amber-400">
                <FaDownload className="text-xl text-amber-400 group-hover:animate-bounce" />
                <span className="text-lg">Download App</span>
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-yellow-400 hover:from-yellow-300 to-orange-300 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-300/30"
              >
                <FaPlay className="text-xl text-amber-900" />
                <span className="text-lg text-amber-900 font-semibold">Watch Video</span>
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE AREA */}
          <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px]">
            {/* Main Food Image */}
            <div className="relative rounded-full p-1 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 shadow-2xl z-20 w-[250px] xs:w-[300px] sm:w-[350px] h-[250px] xs:h-[300px] sm:h-[350px] mx-auto">
              <img
                src={bannerImage}
                alt="Delicious food"
                className="rounded-full border-4 xs:border-8 border-amber-900 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40" />
            </div>

            {/* Orbiting Small Images */}
            {orbitImages.map((imgSrc, index) => (
              <div
                key={index}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 orbit animate-[spin_15s_linear_infinite] delay-[${index * 300}ms]`}
              >
                <div className="w-[80px] xs:w-[100px] sm:w-[120px] h-[80px] xs:h-[100px] sm:h-[120px]">
                  <img
                    src={imgSrc}
                    alt={`Orbiting dish ${index + 1}`}
                    className="w-full h-full rounded-full border-4 border-amber-500/30 shadow-lg bg-amber-900/60 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-amber-400 hover:text-amber-300 text-3xl z-10 transition-all"
          >
            <FaTimes />
          </button>
          <div className="w-full max-w-4xl mx-auto">
            <video controls autoPlay className="w-full aspect-video object-contain rounded-lg shadow-2xl">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
