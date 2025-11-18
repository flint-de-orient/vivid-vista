import dbConnect from '../../lib/mongodb';
import Deed from '../../models/Deed';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const deed = await Deed.create(req.body);
      res.status(201).json(deed);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const deeds = await Deed.find({}).populate('plot_details.plot_id').populate('plot_details.khatian_id');
    res.status(200).json(deeds);
  }
}