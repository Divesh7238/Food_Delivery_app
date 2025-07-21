import React, { useState } from 'react'

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: 0,
    hearts: 0,
    total: 0,
    image: null,
    preview: ''
  })

  const [categories] = useState([
    'Breakfast',
    'Lunch',
    'Dinner',
    'Mexican',
    'Italian',
    'Desserts',
    'Drinks'
  ])

  return (
    <div>AddItems</div>
  )
}

export default AddItems
