import axios from "axios";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth"; // Added mammoth for DOCX extraction

export const extractDocumentText = async (fileUrl, fileType) => { // Changed function name and added fileType parameter
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const fileBuffer = Buffer.from(response.data); // Renamed to fileBuffer

    // Added conditional routing based on fileType
    if (fileType.includes("pdf")) {
      const parser = new PDFParse({
        data: fileBuffer,
      });
      const data = await parser.getText();
      return data.text;
    } 
    else if (fileType.includes("word") || fileType.includes("docx")) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    } 
    else if (fileType.includes("text") || fileType.includes("plain")) {
      return fileBuffer.toString("utf-8");
    } 
    else {
      throw new Error("Unsupported file type for extraction");
    }

  } catch (error) {
    console.error("Extraction Error:", error); // Updated error message
    throw new Error("Failed to extract document text");
  }
};