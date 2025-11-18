import dbConnect from '../../../lib/mongodb';
import Khatian from '../../../models/Khatian';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { khatians } = req.body;
      const results = await Khatian.insertMany(khatians, { ordered: false });
      res.status(201).json({ success: true, inserted: results.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}