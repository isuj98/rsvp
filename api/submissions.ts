
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://justinejusi98_db_user:QMXbwUXOrYvXPHMo@rsvp.porkr0i.mongodb.net/admin?retryWrites=true&w=majority";

// Cache the client globally for serverless functions
let clientPromise: Promise<MongoClient>;

if (!clientPromise) {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  clientPromise = client.connect();
}

export default async function handler(req: any, res: any) {
  try {
    // Use the cached connection
    const client = await clientPromise;
    const db = client.db('wedding');
    const collection = db.collection('submissions');

    if (req.method === 'GET') {
      const submissions = await collection.find({}).sort({ timestamp: -1 }).toArray();
      return res.status(200).json(submissions);
    }

    if (req.method === 'POST') {
      const submission = req.body;
      await collection.updateOne(
        { guestName: submission.guestName },
        { $set: submission },
        { upsert: true }
      );
      return res.status(201).json({ message: 'RSVP recorded' });
    }

    if (req.method === 'DELETE') {
      const { guestName } = req.body;
      await collection.deleteOne({ guestName });
      return res.status(200).json({ message: 'Submission removed' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    console.error('MongoDB error:', e);
    res.status(500).json({ error: 'Database connection failed', details: e instanceof Error ? e.message : 'Unknown error' });
  }
  // Don't close the connection - let it be reused in serverless environment
}
