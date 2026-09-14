import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    cachedDb = await mongoose.connect(MONGODB_URI);
    return cachedDb;
}
const Session = mongoose.models.Session || mongoose.model('Session', new mongoose.Schema({ phoneOrId: String, sessionData: Object }, { strict: false }));

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();
    await connectToDatabase();
    
    try {
        const data = await Session.findOne({ phoneOrId: req.query.phoneOrId });
        if (data) res.status(200).json({ success: true, data: data.sessionData });
        else res.status(404).json({ success: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
