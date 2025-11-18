import dbConnect from '../../lib/mongodb';
import Khatian from '../../models/Khatian';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const khatian = await Khatian.create(req.body);
      res.status(201).json(khatian);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const khatians = await Khatian.find({});
    res.status(200).json(khatians);
  }
}