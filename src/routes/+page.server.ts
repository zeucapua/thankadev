import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "$env/static/private";
import type { Actions } from "@sveltejs/kit";

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

export const actions: Actions = {
  generateThanksSBOM: async ({ request }) => {
    const formData = await request.formData();
    const subject = formData.get("subject") as string;
    const sbom = formData.get("sbom") as string;

    const result = await model.generateContent(`
      You are a developer of the repository ${subject} that uses the following libraries from GitHub:
      ${JSON.stringify(sbom)}

      For each library repository, fetch its GitHub description and its owner's image 
      and thank its authors based on how useful it is. Ensure the note is less than 280 characters long.

      Return the thank you notes with this schema ONLY as JSON array:
      {
        repository_name: string;
        repository_description: string;
        repository_image: string;
        generated_thank_you_note: string;
      }[]
    `); 

    console.log({ text: result.response.text() });

    return { result: result.response.text() }
  }
}
