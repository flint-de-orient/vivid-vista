import mongoose from 'mongoose';

const DeedSchema = new mongoose.Schema({
  deed_no: { type: String, required: true, unique: true },
  deed_date: { type: Date, required: true },
  plot_details: [{
    plot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
    khatian_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Khatian', required: true },
    sold_area: { type: Number, required: true },
    sold_by: { type: String, enum: ['attorney', 'heir'], required: true },
    relation: { type: String, required: true }
  }]
}, { timestamps: true });

export default mongoose.models.Deed || mongoose.model('Deed', DeedSchema);