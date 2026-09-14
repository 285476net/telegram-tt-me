import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(MONGODB_URI);
    cachedDb = db;
    return db;
}

const sessionSchema = new mongoose.Schema({
    phoneOrId: String,
    sessionData: Object,
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    await connectToDatabase();
    
    try {
        await Session.findOneAndUpdate(
            { phoneOrId: req.body.phoneOrId },
            { sessionData: req.body.sessionData, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
