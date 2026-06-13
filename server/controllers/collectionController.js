import Collection from "../models/Collection.js";
import Activity from "../models/Activity.js";
import Document from "../models/Document.js"; // <-- ADDED MISSING MODEL IMPORT
// --- ADD THESE TWO IMPORTS ---
import { generateSummary } from "../services/aiService.js";
import { extractDocumentText } from "../services/pdfService.js";

// CREATE COLLECTION
export const createCollection = async (req, res) => {
  try {
    

    const {
  name,
  desc,
  privacy,
  color,
} = req.body;

if (!name?.trim()) {
  return res.status(400).json({
    success: false,
    message:
      "Collection name is required",
  });
}

if (name.length > 50) {
  return res.status(400).json({
    success: false,
    message:
      "Collection name too long",
  });
}

const existing =
  await Collection.findOne({
    createdBy: req.user.id,
    name: name.trim(),
  });

if (existing) {
  return res.status(400).json({
    success: false,
    message:
      "Collection already exists",
  });
}

const newCollection =
  await Collection.create({
    name: name.trim(),
    desc,
    privacy,
    color,
    createdBy: req.user.id,
  });
  await Activity.create({
  userId: req.user.id,
  action: "created_collection",
  documentName: newCollection.name,
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
      .populate(
  "documents",
  "title fileType"
) // populate to get document counts/details later
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
    const document =
  await Document.findOne({
    _id: documentId,
    uploadedBy: req.user.id,
  });

if (!document) {
  return res.status(404).json({
    success: false,
    message:
      "Document not found",
  });
}

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

// GET SINGLE COLLECTION (WITH POPULATED DOCUMENTS)
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("documents"); // Populates the full file data

    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }
    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUMMARIZE ENTIRE COLLECTION
export const summarizeCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("documents");

    if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });
    if (collection.documents.length === 0) return res.status(400).json({ success: false, message: "Collection is empty" });

    // Combine text from all documents
    let combinedText = "COLLECTION TITLE: " + collection.name + "\n\n";
    
    for (const doc of collection.documents) {
      // To save processing, use existing document summary if it exists, otherwise extract raw text
      if (doc.summary) {
        combinedText += `--- Document: ${doc.title} ---\n${doc.summary}\n\n`;
      } else {
        const text = await extractDocumentText(doc.fileUrl, doc.fileType);
        combinedText += `--- Document: ${doc.title} ---\n${text.substring(0, 3000)}\n\n`; // Limit text per doc
      }
    }

    // Generate meta-summary
    const collectionSummary = await generateSummary(
      "Synthesize the overarching themes, connections, and key points across this collection of documents:\n\n" + combinedText
    );

    collection.aiSummary = collectionSummary;
    await collection.save();

    res.status(200).json({ success: true, summary: collectionSummary, collection });
  } catch (error) {
    console.error("Collection Summary Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};