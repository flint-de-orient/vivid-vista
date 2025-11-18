import dbConnect from '../../../lib/mongodb';
import Khatian from '../../../models/Khatian';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const khatian = await Khatian.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(khatian);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Khatian.findByIdAndDelete(id);
      res.status(200).json({ message: 'Khatian deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}