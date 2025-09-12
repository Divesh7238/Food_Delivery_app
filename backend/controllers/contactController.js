export const submitContact = (req, res) => {
  const { name, phone, email, address, dish, query } = req.body;

  if (!name || !email || !query) {
    return res.status(400).json({ success: false, message: 'Name, email, and query are required.' });
  }

  
  console.log('Contact form submission:', { name, phone, email, address, dish, query });

  res.status(200).json({ success: true, message: 'Contact query submitted successfully.' });
};
