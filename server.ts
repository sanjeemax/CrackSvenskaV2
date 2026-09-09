import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const PORT = 3000;

  // API route for Swedish text analysis and cracking vocabulary
  app.post("/api/crack", async (req, res) => {
    try {
      const { text, customApiKey, difficulty = "intermediate" } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required and must be a string." });
      }

      // Check for user-provided API key, fallback to server's GEMINI_API_KEY
      const apiKey = customApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(400).json({
          error: "Gemini API key is not configured. Please enter your Gemini API Key in the settings gear icon at the top right."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Calibrate selection based on hardness level
      const validDifficulty = (difficulty === "very_basic" || difficulty === "beginner" || difficulty === "advanced")
        ? difficulty
        : "intermediate";

      const difficultyConfig: Record<string, { directive: string; countInstruction: string }> = {
        very_basic: {
          countInstruction: "extract 12 to 18 vocabulary words spanning ALL levels from easy to hard in progressive order",
          directive: `TARGET DIFFICULTY LEVEL: ALL LEVELS FROM EASY TO HARD (LOWEST LEVEL / FULL SPECTRUM)
- CRITICAL USER INTENT: When this lowest/easiest level is selected, DO NOT extract only easy words! Instead, extract a comprehensive deck of words across the text covering ALL levels from EASY to MEDIUM to HARD!
- Word count: Extract 12 to 18 words (or all available words if the text is short) covering:
  1. EASY words: basic high-frequency verbs (t.ex. vara, komma, gå, se), everyday nouns (t.ex. dag, mat, tid, bok), simple adjectives (t.ex. bra, stor, ny).
  2. MEDIUM words: standard conversational and news vocabulary, common compound words, practical expressions.
  3. HARD words: advanced, nuanced, formal, specialized, or complex compound words.
- PROGRESSION ORDER (MANDATORY): Sort the returned array from EASIEST to HARDEST. The first items must be easy words, the middle items medium words, and the final items the hardest words in the text.
- For each item, set 'difficulty' attribute to strictly one of: 'easy', 'medium', or 'hard'.`
        },
        beginner: {
          countInstruction: "extract 8 to 12 vocabulary words ranging from foundational to moderate",
          directive: `TARGET DIFFICULTY LEVEL: NYBÖRJARE / BEGINNER (CEFR A1–B1)
- Extract 8 to 12 vocabulary words. Include foundational words along with moderate words from the text. Skip hyper-trivial words like 'och', 'en', 'ett'.
- Order words progressively from easier to more challenging.
- For each item, set 'difficulty' to 'easy' or 'medium'.`
        },
        intermediate: {
          countInstruction: "extract 7 to 10 moderate-to-challenging vocabulary words",
          directive: `TARGET DIFFICULTY LEVEL: MELLANNIVÅ / INTERMEDIATE (CEFR B1–B2)
- Extract 7 to 10 moderate to challenging Swedish vocabulary words from the text (e.g. common compound nouns, news expressions, idiomatic phrases).
- Skip basic everyday words.
- For each item, set 'difficulty' to 'medium' or 'hard'.`
        },
        advanced: {
          countInstruction: "extract 6 to 9 advanced, formal, and difficult vocabulary words",
          directive: `TARGET DIFFICULTY LEVEL: AVANCERAD / ADVANCED (CEFR C1–C2)
- Extract 6 to 9 of the most sophisticated, formal, complex compound, or difficult Swedish vocabulary words from the text.
- STRICTLY EXCLUDE easy and basic words. Only extract words that challenge advanced learners.
- For each item, set 'difficulty' to 'hard'.`
        }
      };

      const selectedConfig = difficultyConfig[validDifficulty] || difficultyConfig.intermediate;

      // Swedish text prompt
      const prompt = `Analyze this Swedish text and ${selectedConfig.countInstruction} based strictly on the chosen learner difficulty level.

${selectedConfig.directive}

CRITICAL RULES FOR MULTIPLE CHOICE OPTIONS (VERY IMPORTANT):
1. STRICTLY EQUAL LENGTH FOR ALL OPTIONS: The correct definition ('correctDefinition') and the three incorrect distractors ('distractors') MUST HAVE NEARLY IDENTICAL LENGTH AND WORD COUNT (within 1 to 2 words of each other).
2. DO NOT MAKE THE CORRECT ANSWER OBVIOUS: Never make the correct answer significantly longer, more elaborate, or more descriptive than the distractors. A common flaw is making the real answer a long sentence while the wrong answers are short 1-word or 2-word guesses — this is STRICTLY FORBIDDEN.
3. CONCISE & PARALLEL DEFINITIONS:
   - Keep all definitions concise (2 to 5 words max).
   - If 'correctDefinition' is 3 words (e.g., 'to make decisions'), all 3 distractors MUST also be plausible 3-word definitions (e.g., 'to postpone public debates', 'to announce new regulations', 'to question official statements').
   - If 'correctDefinition' is 1-2 words (e.g., 'renewable energy'), all 3 distractors MUST also be 1-2 words (e.g., 'fossil fuel', 'nuclear power', 'thermal storage').
4. GRAMMATICAL PARALLELISM: All 4 options must share the exact same part of speech and grammatical format (e.g., all verbs in infinitive starting with 'to...', all noun phrases, or all adjectives).
5. PLAUSIBILITY: All distractors must be realistic, credible alternative meanings so the student must truly know the Swedish word.
6. CONTEXTUAL EXPLANATION: Put any deeper context or sentence nuances ONLY in 'contextualExplanation', NEVER inside 'correctDefinition' or 'distractors'.

Swedish Text to crack:
${text}
`;

      const responseSchema = {
        type: Type.ARRAY,
        description: "List of vocabulary questions calibrated to the requested difficulty level with strictly balanced option lengths.",
        items: {
          type: Type.OBJECT,
          properties: {
            swedishWord: {
              type: Type.STRING,
              description: "The target Swedish word from the text."
            },
            correctDefinition: {
              type: Type.STRING,
              description: "The correct English definition (concise, 2-5 words). Must strictly match the word count, length, and style of the distractors."
            },
            distractors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly three plausible incorrect English definitions. MUST be of the EXACT same length, word count, and grammatical structure as correctDefinition."
            },
            contextualExplanation: {
              type: Type.STRING,
              description: "A concise 1-2 sentence contextual explanation of how this Swedish word is used in this text."
            },
            difficulty: {
              type: Type.STRING,
              description: "Difficulty classification for this specific word: 'easy', 'medium', or 'hard'."
            }
          },
          required: ["swedishWord", "correctDefinition", "distractors", "contextualExplanation"]
        }
      };

      // Candidate models for resilience: primary default + standard fallbacks
      const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let lastError: any = null;
      let jsonText: string | null = null;

      for (let i = 0; i < candidateModels.length; i++) {
        const modelName = candidateModels[i];
        try {
          console.log(`Decoding Swedish text with model: ${modelName} (attempt ${i + 1}/${candidateModels.length})`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ text: prompt }],
            config: {
              responseMimeType: "application/json",
              responseSchema
            }
          });

          if (response.text) {
            jsonText = response.text;
            break; // Succeeded!
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} encountered an error:`, err?.message || err);
          
          if (i < candidateModels.length - 1) {
            // Pause 1 second before trying the next candidate model
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      if (!jsonText) {
        throw lastError || new Error("Unable to decode text at this moment.");
      }

      const parsedData = JSON.parse(jsonText);
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid format received from language decoder.");
      }

      // Sanitize and ensure consistency
      const sanitizedVocab = parsedData.map((item: any, idx: number) => {
        const rawDiff = String(item.difficulty || "").toLowerCase();
        let wordDiff = "medium";
        if (rawDiff.includes("easy") || rawDiff.includes("basic") || rawDiff.includes("lätt") || rawDiff.includes("beg") || rawDiff.includes("enk")) {
          wordDiff = "easy";
        } else if (rawDiff.includes("hard") || rawDiff.includes("adv") || rawDiff.includes("svår")) {
          wordDiff = "hard";
        } else if (rawDiff.includes("med") || rawDiff.includes("inter")) {
          wordDiff = "medium";
        } else if (validDifficulty === "very_basic") {
          // If level is lowest (all words easy-to-hard), assign based on progression index
          wordDiff = idx < Math.floor(parsedData.length / 3) 
            ? "easy" 
            : idx < Math.floor((parsedData.length * 2) / 3) 
            ? "medium" 
            : "hard";
        } else if (validDifficulty === "advanced") {
          wordDiff = "hard";
        } else if (validDifficulty === "beginner") {
          wordDiff = idx < Math.floor(parsedData.length / 2) ? "easy" : "medium";
        }

        return {
          swedishWord: String(item.swedishWord || "").trim(),
          correctDefinition: String(item.correctDefinition || "").trim(),
          distractors: Array.isArray(item.distractors) 
            ? item.distractors.slice(0, 3).map((d: any) => String(d || "").trim())
            : [],
          contextualExplanation: String(item.contextualExplanation || "").trim(),
          difficulty: wordDiff,
        };
      }).filter((item: any) => item.swedishWord && item.correctDefinition && item.distractors.length >= 2);

      // When lowest level is selected, ensure words are sorted progressively: easy -> medium -> hard
      if (validDifficulty === "very_basic") {
        const rank: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
        sanitizedVocab.sort((a: any, b: any) => (rank[a.difficulty] || 2) - (rank[b.difficulty] || 2));
      }

      return res.json({ 
        vocabulary: sanitizedVocab,
        difficulty: validDifficulty 
      });
    } catch (error: any) {
      console.error("Gemini API server-side error:", error);

      // Extract user-friendly error message from SDK / JSON
      let userFriendlyMessage = "An unexpected error occurred while communicating with the Gemini API.";
      const rawMsg = typeof error?.message === "string" ? error.message : JSON.stringify(error);

      try {
        const parsed = JSON.parse(rawMsg);
        if (parsed?.error?.message) {
          userFriendlyMessage = parsed.error.message;
        }
      } catch {
        if (error.message) {
          userFriendlyMessage = error.message;
        }
      }

      // Detect temporary capacity spike or rate limit
      const lower = (userFriendlyMessage + " " + rawMsg).toLowerCase();
      if (
        lower.includes("503") ||
        lower.includes("high demand") ||
        lower.includes("unavailable") ||
        lower.includes("overloaded")
      ) {
        userFriendlyMessage = "The AI language decoder is currently experiencing temporary high demand. Please click 'Try Again' in a few seconds.";
      } else if (
        lower.includes("429") ||
        lower.includes("resource_exhausted") ||
        lower.includes("quota")
      ) {
        userFriendlyMessage = "Request limit reached. Please wait a moment and try again.";
      } else if (lower.includes("api_key_invalid") || lower.includes("unauthenticated")) {
        userFriendlyMessage = "Invalid Gemini API Key. Please verify your custom key in Settings.";
      }

      return res.status(503).json({
        error: userFriendlyMessage
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express-Vite Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
