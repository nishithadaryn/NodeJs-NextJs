// backend/src/db/mongodbClient.js
import mongoose from "mongoose";

/**
 * MongoDBClient - Singleton wrapper for Mongoose
 */
class MongoDBClient {
  static instance = null;

  constructor() {
    if (!MongoDBClient.instance) {
      this.mongodb = mongoose.connection;
      MongoDBClient.instance = this;
    }
    return MongoDBClient.instance;
  }

  /**
   * Get collection (raw mongoose collection)
   */
  getCollection(model) {
    return mongoose.connection.collection(model.collectionName);
  }

  /**
   * Insert document
   */
  async insert(model, data) {
    const now = new Date();
    const withTimestamps = { ...data, created_at: now, updated_at: now };
    return await model.create(withTimestamps);
  }

  /**
   * Get document by ID
   */
  async get(model, id) {
    const doc = await model.findById(id).lean();
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  }

  /**
   * List all documents
   */
  async list(model) {
    const docs = await model.find({}).lean();
    return docs.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
  }

  /**
   * Delete all documents
   */
  async deleteMany(model) {
    return await model.deleteMany({});
  }

  /**
   * Update one document by ID
   */
  async updateOne(model, id, data) {
    const now = new Date();
    return await model.updateOne(
      { _id: id },
      { $set: { ...data, updated_at: now } }
    );
  }
}

export default new MongoDBClient();
