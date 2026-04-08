import { GoogleGenAI } from '@google/genai';

async function analyzeProfile(profileData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('❌ GEMINI_API_KEY missing in environment.');
    return mockAnalysis(profileData);
  }

  // Validate key format (optional but helpful)
  if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️ API key does not look like a valid Gemini key.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `...`; // your prompt

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    // Log the raw response for debugging
    console.log('Gemini response keys:', Object.keys(response));

    let textResp = response.text;
    if (!textResp && response.candidates?.[0]?.content?.parts?.[0]?.text) {
      textResp = response.candidates[0].content.parts[0].text;
    }

    if (!textResp) {
      console.error('No text in response. Full response:', response);
      throw new Error('Empty response from Gemini');
    }

    console.log('🔍 Gemini Raw Response:\n', textResp);

    const jsonMatch = textResp.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    const cleaned = textResp.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (error) {
    console.error('❌ Gemini API Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      responseData: error.response?.data,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    return mockAnalysis(profileData);
  }
}

export default analyzeProfile