import express from "express";
import cors from "cors";
import { connectToMongo } from "./mongodb.js";
import { errorcodes } from "./errorcodes.js";
import fileuploader from "express-fileupload";
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(fileuploader());
app.use(function (req, res, next) {
  console.log(req.url);
  next();
});

app.post("/signin", async function (req, res) {
  const { username, password } = req.body;
  const client = await connectToMongo();
  const database = client.db("realestate");
  const collection = database.collection("account");
  const data = await collection.find({ username }).toArray();
  await client.close();
  if (data.length > 0 && password != data[0].password) {
    res.sendStatus(201);
    return;
  }

  if (data[0].userType !== "sell") {
    res.sendStatus(202);
    return;
  }
  res.sendStatus(200);
});

app.post("/register", async function (req, res) {
  const { username, password, userType, email } = req.body;
  const client = await connectToMongo();
  const database = client.db("realestate");
  const collection = database.collection("account");
  const data = await collection.find({ username }).toArray();
  if (data && data.length > 0) {
    res.sendStatus(400);
    return;
  }

  const emailResponse = await collection.find({ email }).toArray();
  if (emailResponse && emailResponse.length > 0) {
    res.sendStatus(400);
    return;
  }

  await collection.insertOne({
    username,
    email,
    password,
    userType,
  });

  await client.close();
  res.sendStatus(200);
});

app.post("/addProperty", async function (req, res) {
  const { location, age, bedrooms, additionalFacilities, username, id } =
    req.body;
  const { data, mimetype } = req.files.file;

  const client = await connectToMongo();
  const database = client.db("realestate");
  const collection = database.collection("property");
  await collection.insertOne({
    id,
    location,
    age,
    bedrooms,
    additionalFacilities,
    username,
    image: {
      data,
      mimetype,
    },
  });
  await client.close();
  res.send(200);
});

app.post("/getProperties", async function (req, res) {
  const { username } = req.body;
  console.log(username);
  const client = await connectToMongo();
  const database = client.db("realestate");
  const collection = database.collection("property");
  const data = await collection.find({ username }).toArray();
  await client.close();
  res.status(200);
  res.send(data);
  return;
});

app.post("/deleteProperty", async function (req, res) {
  const { id, username } = req.body;
  const client = await connectToMongo();
  const database = client.db("realestate");
  const collection = database.collection("property");
  await collection.deleteOne({ id, username });
  await client.close();
  res.sendStatus(200);
});

app.listen(port);
