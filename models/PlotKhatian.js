import mongoose from 'mongoose';

const PlotKhatianSchema = new mongoose.Schema({
  plot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
  khatian_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Khatian', required: true },
  land_share: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.PlotKhatian || mongoose.model('PlotKhatian', PlotKhatianSchema);