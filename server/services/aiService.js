import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export const generateSummary = async (
  documentText
) => {
  try {

    console.log(
      "GEMINI KEY:",
      process.env.GEMINI_API_KEY
        ? "Loaded"
        : "Missing"
    );

   const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });


    const prompt = `
You are an AI document assistant.

Analyze the document and generate:

1. A concise summary
2. Key points
3. Important information
4. Action items (if any)

Keep the response under 200 words.

Document:

${documentText}
`;


    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    return response.text();

  } catch (error) {

    console.error("Gemini Error:", error?.message || error);
    // Log any HTTP response body from the underlying client for easier debugging
    try {
      if (error?.response) {
        console.error("Gemini Response Error:", error.response);
        if (error.response.data) {
          console.error("Gemini Response Data:", error.response.data);
        }
      }
    } catch (logErr) {
      console.error("Error while logging Gemini response:", logErr);
    }

    throw new Error("Failed to generate summary");

  }
};