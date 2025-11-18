import dbConnect from '../../../lib/mongodb';
import Plot from '../../../models/Plot';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const plot = await Plot.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(plot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Plot.findByIdAndDelete(id);
      res.status(200).json({ message: 'Plot deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}