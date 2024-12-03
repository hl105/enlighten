import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import logger from "morgan";
import * as path from "path";
import multer from "multer";
import fs from "fs";
import { ObjectId } from "mongodb";

// The following line sets up the environment variables before everything else.
dotenv.config();

import MongoStore from "connect-mongo";
import { connectDb } from "../server/db";
import db from '../server/db'
import { appRouter } from "../server/routes";

export const app = express();
const PORT = process.env.PORT || 3000;
app.use(logger("dev"));

app.use(cors()); // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

app.use(express.json()); // Enable parsing JSON in requests and responses.
app.use(express.urlencoded({ extended: false })); // Also enable URL encoded request and responses.

// Session allows us to store a cookie 🍪.
app.use(
  session({
    secret: process.env.SECRET || "Hello 6.1040",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_SRV,
      dbName: "mongo-sessions",
    }),
  }),
);

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/", appRouter);

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // Convert the file buffer to a Base64 string
  const base64Image = req.file.buffer.toString('base64');

  // Save the Base64 string to MongoDB
  const imageDoc = {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    data: base64Image,
  };

  try {
    // Get the database instance
    const db = req.app.locals.db;

    const result = await db.collection('images').insertOne(imageDoc);

    // Return the image ID
    res.json({ imageId: result.insertedId.toString() });
  } catch (error) {
    console.error('Error saving image to MongoDB:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});


// Define the route to retrieve images
app.get('/api/images/:imageId', async (req, res) => {
  const { imageId } = req.params;

  try {
    const db = req.app.locals.db;

    const imageDoc = await db.collection('images').findOne({ _id: new ObjectId(imageId) });
    if (!imageDoc) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Convert the Base64 string back to binary data
    const imgBuffer = Buffer.from(imageDoc.data, 'base64');

    // Set the content type and send the image
    res.set('Content-Type', imageDoc.contentType);
    res.send(imgBuffer);
  } catch (error) {
    console.error('Error retrieving image from MongoDB:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});


// For all unrecognized requests
app.all("*", (req, res) => {
  res.status(404).json({
    msg: "Page not found",
  });
});

void connectDb().then(() => {
  app.locals.db = db;
  app.listen(PORT, () => {
    console.log("Started listening on port", PORT);
  });
});

export default app;
