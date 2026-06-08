import Collection from "../models/Collection.js";
import Activity from "../models/Activity.js";
import Document from "../models/Document.js"; // <-- ADDED MISSING MODEL IMPORT

// CREATE COLLECTION
export const createCollection = async (req, res) => {
  try {
    const { name, desc, privacy, color } = req.body;

    const newCollection = await Collection.create({
      name,
      desc,
      privacy,
      color,
      createdBy: req.user.id,
    });

    await Activity.create({
      userId: req.user.id,
      action: "created_collection",
      documentName: newCollection.name, // using documentName field to store collection name
    });

    res.status(201).json({ success: true, collection: newCollection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL COLLECTIONS FOR USER
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ createdBy: req.user.id })
      .populate("documents") // populate to get document counts/details later
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TOGGLE STAR STATUS
export const toggleStarCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    collection.starred = !collection.starred;
    await collection.save();

    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE COLLECTION
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    await Activity.create({
      userId: req.user.id,
      action: "deleted_collection",
      documentName: collection.name,
    });

    res.status(200).json({ success: true, message: "Collection deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD DOCUMENT TO COLLECTION
export const addDocumentToCollection = async (req, res) => {
  try {
    const { documentId } = req.body;
    const collectionId = req.params.id;

    // $addToSet prevents the same document from being added twice
    const collection = await Collection.findOneAndUpdate(
      { _id: collectionId, createdBy: req.user.id },
      { $addToSet: { documents: documentId } }, 
      { new: true }
    ).populate("documents");

    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};