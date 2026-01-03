
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
    const collection = db.collection('guests');

    if (req.method === 'GET') {
      const guests = await collection.find({}).toArray();
      // If DB is empty, seed with initial list provided in the prompt
      if (guests.length === 0) {
        const initialList = ["Mervin Escritor", "Baby Lyn Escritor", "Darrie Mae Escritor", "Chelsea Mari Escritor", "Kaira Maddelaine Escritor", "Myrna Escritor", "Dolores Bejasa", "Diana Lavides", "Florante Lavides", "Darwin Escritor", "Ana Escritor", "Atisha Escritor", "Cyrus Escritor", "Simon Lehi Escritor", "Arriane Escritor", "Ryan Barrios", "Sarah Jane Barrios", "Jacob Barrios", "Jayden Barrios", "Justine Escritor", "Tracy", "Jose Bejasa Jr.", "Michelle Bejasa", "Rico Allan Bejasa", "Del Bejasa", "Derick Bejasa", "Rain Bejasa", "Lovely Fortaleza", "Rudy Fortaleza", "Luke Josh Fortaleza", "Jairo Fortaleza", "Nicole Ann Diestro", "Rodjove Fortaleza", "Maria Shiela Monares", "Jason Monares", "Jovie Monares", "Corazon Anggay", "Carmela Cusi", "Leo Cusi", "Karen Faye Umali", "Marco Polo Umali", "Mharla Kaye Umali", "Katrina Mae Cusi", "Consuelo Anggay", "Anchie Landicho", "Rodelo Anggay", "Imelda Hernandez", "Ronnie Hernandez", "Aaron Jamiel Hernandez", "Aila Ronneth Hernandez", "Analiza Landicho", "Janella Mae Landicho", "Rose Anne Landicho", "Freya Jean Mapaye", "Christian Landicho", "Ellamel", "Christopher Landicho", "Manolo Anggay", "Florida Anggay", "Andrea Lou Anggay", "Rico Anggay", "Shiela Anggay", "Gian Carlo Anggay", "Gelianne Anggay", "Junnelle Amido", "Arma Amido", "Syndrx Amido", "Kyth Amido", "John Victor Anda", "Joan Valloso Belmonte", "Quiana May Marvy Anda", "Anne Kimberly Lalonga", "Ma. Theresa Mae Diaz", "Radhell Berbon", "Jhamiel Lusanta", "Roselle Luistro", "Bryan Montrero", "Norlyn Christine", "Justine Jusi", "Noreen Jusi", "Kane Olivier Norzales", "Jorily Ann Ayuban", "Juvia Kyrie Norzales", "Jan Henry Mcale", "Angelique Lorraine Ibones", "King Philip Limbo", "Kim Robert Callos", "Racel Caliwara", "Ma. Anna Lorraine Maniti", "Rudy Gaspar", "Katrine Rose Gaspar", "Reshen Valdez", "Isiah Mark Valdez", "Nimfa Rico", "Jose Rico", "Joel Arabe", "Eunice Evangelista", "Carlo Villasin", "Omarie Umali Gio", "Jamaica Louise", "Reina Valladolid", "Glaiza Mae Cantos", "Maria Cezarie Romano", "Princess Marie Joy Dela Carzada", "Cyrene Joi Silverman", "Daniel Silverman", "Robbie Silverman", "Mitcheline Pangiligan Von", "Jaycel Ann", "Judy Rose Magbiray", "Carlo Magbiray", "Judy Ann Mendoza", "Joel Mendoza", "Kiya Alora", "Joward Martillana", "Nikko Bautista", "Jose Conrado Maza", "Paul Angelo Papiña", "Alyzza Papiña", "Jun Dranreb Caagbay", "Israel Frago", "Jennifer Royo", "Glory Jane Mercurio", "Gerard Franklin Belazon", "Riza Manalo", "Andrew Calingasan", "Joanne Marie Nera", "Aubrey Ann Carneo", "John Mark Carneo", "Loina Sinuhin", "Ruel De Villa", "Ronalyn Castro", "Lovely Artiaga", "Ma. Angelica Barao", "Michelle Dela Peña", "Ptr. Ronald Ruiz", "Ptr. Jannet Ruiz", "Ptr. Niño Marpa", "Ptr. Kathleen Marpa", "Leonardo Felix", "Eugelyn Felix", "Alfred Racela", "Alvin Salvacion"];
        const seedData = initialList.map(name => ({ name }));
        await collection.insertMany(seedData);
        return res.status(200).json(initialList);
      }
      return res.status(200).json(guests.map(g => g.name));
    }

    if (req.method === 'POST') {
      const { name } = req.body;
      await collection.updateOne({ name }, { $set: { name } }, { upsert: true });
      return res.status(201).json({ message: 'Guest added' });
    }

    if (req.method === 'DELETE') {
      const { name } = req.body;
      await collection.deleteOne({ name });
      return res.status(200).json({ message: 'Guest removed' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    console.error('MongoDB error:', e);
    res.status(500).json({ error: 'Database connection failed', details: e instanceof Error ? e.message : 'Unknown error' });
  }
  // Don't close the connection - let it be reused in serverless environment
}
