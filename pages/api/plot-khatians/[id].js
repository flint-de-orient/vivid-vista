import dbConnect from '../../../lib/mongodb';
import PlotKhatian from '../../../models/PlotKhatian';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const mapping = await PlotKhatian.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(mapping);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await PlotKhatian.findByIdAndDelete(id);
      res.status(200).json({ message: 'Mapping deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}