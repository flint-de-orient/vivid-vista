import dbConnect from '../../lib/mongodb';
import Purchaser from '../../models/Purchaser';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const purchaser = await Purchaser.create(req.body);
      res.status(201).json(purchaser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const purchasers = await Purchaser.find({});
    res.status(200).json(purchasers);
  }
}