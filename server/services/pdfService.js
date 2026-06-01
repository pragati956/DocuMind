import axios from "axios";
import { PDFParse } from "pdf-parse";

export const extractPdfText =
  async (pdfUrl) => {

    try {

      const response =
        await axios.get(pdfUrl, {
          responseType: "arraybuffer",
        });

      const pdfBuffer =
        Buffer.from(
          response.data
        );

     const parser = new PDFParse({
  data: pdfBuffer,
});

const data =
  await parser.getText();

return data.text;

    } catch (error) {

      console.error(
        "PDF Extraction Error:",
        error
      );

      throw new Error(
        "Failed to extract PDF text"
      );

    }
  };