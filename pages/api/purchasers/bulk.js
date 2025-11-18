import dbConnect from '../../../lib/mongodb';
import Purchaser from '../../../models/Purchaser';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { purchasers } = req.body;
      const results = await Purchaser.insertMany(purchasers, { ordered: false });
      res.status(201).json({ success: true, inserted: results.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}