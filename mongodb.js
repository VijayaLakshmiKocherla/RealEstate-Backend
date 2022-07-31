import { MongoClient, ServerApiVersion } from "mongodb";

export async function connectToMongo() {
  try{
    const uri =
    "mongodb+srv://karnatipavan1997:karnatipavan@cluster0.k1wo9xg.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  return client;
  } catch(error){
    console.log(error);
  }
}
