import mongoose from 'mongoose';

const PlotSchema = new mongoose.Schema({
  plot_no: { type: String, required: true, unique: true },
  total_land_area: { type: Number, required: true },
  nature_of_land: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Plot || mongoose.model('Plot', PlotSchema);