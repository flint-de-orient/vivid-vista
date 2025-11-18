import dbConnect from '../../../lib/mongodb';
import Plot from '../../../models/Plot';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { plots } = req.body;
      const results = await Plot.insertMany(plots, { ordered: false });
      res.status(201).json({ success: true, inserted: results.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}