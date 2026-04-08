import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Item title is required'], trim: true },
  description: { type: String, required: [true, 'Item description is required'] },
  category: { type: String, required: [true, 'Category is required'] },
  imageUrl: { type: String, default: '' },
  dateFound: { type: Date, required: [true, 'Date is required'] },
  locationFound: { type: String, required: [true, 'Location is required'], trim: true },
  status: { type: String, enum: ['lost', 'found', 'claimed'], default: 'found' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
