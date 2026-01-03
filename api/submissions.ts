
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://justinejusi98_db_user:QMXbwUXOrYvXPHMo@rsvp.porkr0i.mongodb.net/admin?retryWrites=true&w=majority";

// Cache the client globally for Vercel serverless functions
// This pattern reuses connections across function invocations
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

let clientPromise: Promise<MongoClient> | null = null;

function getClient(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default async function handler(req: any, res: any) {
  try {
    // Use the cached connection for Vercel serverless functions
    const mongoClient = await getClient();
    const db = mongoClient.db('wedding');
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
