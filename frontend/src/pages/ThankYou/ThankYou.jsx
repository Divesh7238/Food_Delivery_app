import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a120b] text-amber-200">
    <h1 className="text-4xl font-bold mb-6">Ordered successfully</h1>
    <Link to="/" className="text-amber-400 hover:text-amber-600 text-lg">Go to Home</Link>
  </div>
);

export default ThankYou;