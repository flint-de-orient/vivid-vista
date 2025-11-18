import dbConnect from '../../lib/mongodb';
import Plot from '../../models/Plot';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const plot = await Plot.create(req.body);
      res.status(201).json(plot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const plots = await Plot.find({});
    res.status(200).json(plots);
  }
}