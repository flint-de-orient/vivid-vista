import mongoose from 'mongoose';

const KhatianSchema = new mongoose.Schema({
  khatian_no: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  guardian_name: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Khatian || mongoose.model('Khatian', KhatianSchema);