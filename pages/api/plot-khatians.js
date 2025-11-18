import dbConnect from '../../lib/mongodb';
import PlotKhatian from '../../models/PlotKhatian';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const plotKhatian = await PlotKhatian.create(req.body);
      res.status(201).json(plotKhatian);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const plotKhatians = await PlotKhatian.find({}).populate('plot_id').populate('khatian_id');
    res.status(200).json(plotKhatians);
  }
}