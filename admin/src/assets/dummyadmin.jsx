// File: admin/src/assets/dummyadmin.jsx

import React from 'react'; // Added React import for JSX icons
import {
    FiPlusCircle,
    FiList,
    FiPackage,
    FiTruck, 
    FiCheckCircle, 
    FiClock, 
    FiXCircle, // FiXCircle added for cancelled
    FiCreditCard // Added for online payment
} from 'react-icons/fi';


export const navLinks = [
    { name: 'Add Items', href: '/add', icon: <FiPlusCircle /> },
    { name: 'List Items', href: '/list', icon: <FiList /> },
    { name: 'Orders', href: '/orders', icon: <FiPackage /> },
];


// Status styles for order statuses
export const statusStyles = {
    // Order Statuses (status)
    processing: {
        color: 'text-amber-400',
        bg: 'bg-amber-900/20',
        icon: <FiClock className="text-lg" />, // Icon JSX directly here
        label: 'Processing',
    },
    outForDelivery: {
        color: 'text-blue-400',
        bg: 'bg-blue-900/20',
        icon: <FiTruck className="text-lg" />, // Icon JSX directly here
        label: 'Out for Delivery',
    },
    delivered: {
        color: 'text-green-400',
        bg: 'bg-green-900/20',
        icon: <FiCheckCircle className="text-lg" />, // Icon JSX directly here
        label: 'Delivered',
    },
    cancelled: { 
        color: 'text-red-400',
        bg: 'bg-red-900/20',
        icon: <FiXCircle className="text-lg" />, // Icon JSX directly here
        label: 'Cancelled',
    },
    
    // Payment Statuses (paymentStatus)
    succeeded: {
        color: 'text-green-400',
        bg: 'bg-green-900/20',
        icon: <FiCreditCard className="text-lg" />, 
        label: 'Payment Successful',
    },
    pending: { 
        color: 'text-yellow-400',
        bg: 'bg-yellow-900/20',
        icon: <FiClock className="text-lg" />,
        label: 'Payment Pending',
    }
};

// Payment method label and classes
export const paymentMethodDetails = {
    cod: {
        label: 'COD',
        class: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50',
    },
    online: { 
        label: 'Online Payment',
        class: 'bg-green-600/30 text-green-400 border-green-500/50',
    },
    default: {
        label: 'Unknown',
        class: 'bg-gray-600/30 text-gray-300 border-gray-500/50',
    },
};

// Table layout classes
export const layoutClasses = {
    page: 'py-10 bg-[#1e130c] min-h-screen text-amber-100',
    card: 'p-6 md:p-8 lg:p-10 bg-[#2d1b0e] rounded-xl shadow-2xl',
    heading: 'text-3xl font-bold mb-8 border-b border-amber-500/30 pb-4 text-amber-300',
    form: 'space-y-6',
};

export const tableClasses = {
    wrapper: 'overflow-x-auto shadow-md rounded-lg border border-amber-900/50',
    table: 'w-full text-sm text-left text-amber-100/80',
    headerRow: 'text-xs text-amber-500 uppercase bg-[#3a2b2b] border-b border-amber-900/50',
    headerCell: 'px-6 py-3 font-semibold',
    row: 'bg-[#2d1b0e] border-b border-amber-900/50 hover:bg-[#3a2b2b] transition-colors duration-200',
    cellBase: 'px-6 py-4 whitespace-nowrap',
    cellStatus: (colorClass, bgClass) => `${colorClass} ${bgClass} font-medium px-2.5 py-0.5 rounded-full text-xs text-center`,
};

// ... (अन्य एक्सपोर्ट्स)