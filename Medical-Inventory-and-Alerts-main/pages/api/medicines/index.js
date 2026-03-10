import dbConnect from '@/lib/dbConnect';
import Medicine from '@/models/Medicine';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      const meds = await Medicine.find({});
      return res.status(200).json({ success: true, data: meds });

    case 'POST':
      try {
        const med = await Medicine.create(req.body);
        return res.status(201).json({ success: true, data: med });
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    case 'PUT':
      const { _id, ...updateData } = req.body;
      try {
        const updated = await Medicine.findByIdAndUpdate(_id, updateData, { new: true });
        return res.status(200).json({ success: true, data: updated });
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    case 'DELETE':
      try {
        await Medicine.findByIdAndDelete(req.body._id);
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
