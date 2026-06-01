// import { GoogleGenerativeAI }
// from "@google/generative-ai";

// const genAI =
// new GoogleGenerativeAI(
//  process.env.GEMINI_API_KEY
// );

// export const generateSummary =
// async(text)=>{

// };
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

    console.error(
      "Gemini Error:",
      error
    );

    throw new Error(
      "Failed to generate summary"
    );

  }
};