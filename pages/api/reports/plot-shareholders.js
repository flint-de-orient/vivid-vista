import dbConnect from '../../../lib/mongodb';
import PlotKhatian from '../../../models/PlotKhatian';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { plotId } = req.query;
    
    try {
      const shareholders = await PlotKhatian.find({ plot_id: plotId })
        .populate('plot_id')
        .populate('khatian_id');
      
      const result = shareholders.map(sh => ({
        khatian_no: sh.khatian_id.khatian_no,
        owner: sh.khatian_id.owner,
        guardian_name: sh.khatian_id.guardian_name,
        share_percentage: sh.land_share,
        shared_area: (sh.plot_id.total_land_area * sh.land_share / 100).toFixed(4)
      }));

      const totalShared = shareholders.reduce((sum, sh) => sum + sh.land_share, 0);
      
      res.status(200).json({
        plot: shareholders[0]?.plot_id || null,
        shareholders: result,
        totalShared
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}