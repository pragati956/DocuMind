import Document from "../models/Document.js";
import Activity from "../models/Activity.js";

import {
  extractDocumentText, // Updated import name
} from "../services/pdfService.js";

import {
  generateSummary,
} from "../services/aiService.js";

export const summarizeDocument =
  async (req, res) => {

    try {

      const document =
        await Document.findOne({
          _id: req.params.id,
          uploadedBy:
            req.user.id,
        });
        
      console.log("PARAM ID:", req.params.id);
      console.log("USER ID:", req.user.id);
      console.log("DOCUMENT:", document);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found",
        });
      }
      
      console.log("DOCUMENT:", document.title);
      console.log("FILE URL:", document.fileUrl); // Updated log message

      // Updated allowed types check
      const allowedTypes = ["pdf", "word", "docx", "text", "plain"];
      const isAllowed = allowedTypes.some(type => document.fileType.toLowerCase().includes(type));

      if (!isAllowed) {
        return res.status(400).json({
          success: false,
          message:
            "Only PDF, DOCX, and TXT summarization is supported currently",
        });
      }

      // Passed fileType to the extraction service
      const extractedText =
        await extractDocumentText(
          document.fileUrl,
          document.fileType 
        );
        
      console.log("TEXT LENGTH:", extractedText.length);

      if (
        !extractedText ||
        extractedText.trim()
          .length < 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract enough text from document",
        });
      }

      const summary =
        await generateSummary(
          extractedText
        );
        
      console.log("SUMMARY GENERATED");

      document.summary =
        summary;

      await document.save();
    await Activity.create({
 userId:req.user.id,
 documentId:document._id,
 action:"summary",
 documentName:document.title,
});

      res.status(200).json({
        success: true,
        summary,
        document,
      });

    } catch (error) {

      console.error(
        "AI Summary Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };
  
export const getSummaries =
  async (req, res) => {

    try {

     const documents =
  await Document.find({
    uploadedBy: req.user.id,
    summary: {
      $exists: true,
      $ne: "",
    },
  })
    .populate(
      "uploadedBy",
      "name email"
    )
    .sort({
      updatedAt: -1,
    });

      res.status(200).json({
        success: true,
        documents,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };