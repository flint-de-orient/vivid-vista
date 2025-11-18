import mongoose from 'mongoose';

const PurchaserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guardian_name: { type: String, required: true },
  khatian_no: { type: String }
}, { timestamps: true });

export default mongoose.models.Purchaser || mongoose.model('Purchaser', PurchaserSchema);