import dbConnect from '../../../lib/mongodb';
import Purchaser from '../../../models/Purchaser';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const purchaser = await Purchaser.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(purchaser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Purchaser.findByIdAndDelete(id);
      res.status(200).json({ message: 'Purchaser deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}