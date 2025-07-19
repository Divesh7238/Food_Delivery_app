import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  hearts: { type: Number, default: 0, min: 0 },
  views: { type: Number, default: 0, min: 0 },
  imageUrl: { type: String, default: 'https://example.com/default.jpg' }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
