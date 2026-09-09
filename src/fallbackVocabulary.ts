export interface FallbackWordEntry {
  word: string;
  definition: string;
  distractors: [string, string, string];
  context: string;
  difficulty: "easy" | "medium" | "hard";
  synonyms?: string[];
}

export const SWEDISH_DICTIONARY: FallbackWordEntry[] = [
  // Fika & Social Life
  {
    word: "fika",
    definition: "coffee and pastry break",
    distractors: ["morning team meeting", "quick lunch break", "formal dinner party"],
    context: "Refers to the cherished Swedish social tradition of pausing for coffee and a sweet treat.",
    difficulty: "easy"
  },
  {
    word: "bulle",
    definition: "sweet cardamom or cinnamon bun",
    distractors: ["toasted rye sourdough bread", "savory potato flatbread", "crispy butter waffle"],
    context: "A classic Swedish pastry typically enjoyed alongside brewed coffee during fika.",
    difficulty: "easy"
  },
  {
    word: "kaffe",
    definition: "coffee",
    distractors: ["herbal tea", "hot cocoa", "cold beverage"],
    context: "The core beverage that defines the Swedish fika cultural habit.",
    difficulty: "easy"
  },
  {
    word: "umgås",
    definition: "to socialize and spend time",
    distractors: ["to perform assigned tasks", "to debate official issues", "to travel long distances"],
    context: "Describes spending enjoyable, relaxed time together with friends or coworkers.",
    difficulty: "medium"
  },
  {
    word: "viktigaste",
    definition: "most important",
    distractors: ["least common", "newest created", "most complicated"],
    context: "Superlative form indicating that something carries the highest cultural or practical value.",
    difficulty: "easy"
  },
  {
    word: "traditionerna",
    definition: "the cultural traditions",
    distractors: ["the formal obligations", "the local regulations", "the scheduled meetings"],
    context: "Refers to long-standing customs passed down through Swedish society.",
    difficulty: "medium"
  },
  {
    word: "arbetsplatser",
    definition: "workplaces or work environments",
    distractors: ["sports clubs and centers", "public transportation hubs", "commercial shopping centers"],
    context: "Offices, institutions, and companies where colleagues gather and collaborate.",
    difficulty: "medium"
  },
  {
    word: "gemensam",
    definition: "shared or mutual",
    distractors: ["compulsory or forced", "individual or private", "temporary or brief"],
    context: "Characterizes an activity or space that is participated in collectively.",
    difficulty: "medium"
  },
  {
    word: "stanna upp",
    definition: "to pause and slow down",
    distractors: ["to accelerate quickly", "to walk away quietly", "to wake up early"],
    context: "A phrasal verb meaning to step away from busy routines to be mindful of the moment.",
    difficulty: "easy"
  },
  {
    word: "stunden",
    definition: "the present moment",
    distractors: ["the working week", "the physical building", "the upcoming journey"],
    context: "The specific fleeting moment in time that one takes time to appreciate.",
    difficulty: "easy"
  },
  {
    word: "kollegor",
    definition: "work colleagues or coworkers",
    distractors: ["external company clients", "strict department managers", "new university students"],
    context: "Peers with whom one works closely on a daily basis.",
    difficulty: "easy"
  },
  {
    word: "dricka",
    definition: "to drink",
    distractors: ["to prepare", "to enjoy", "to order"],
    context: "Basic verb meaning consuming liquids.",
    difficulty: "easy"
  },
  {
    word: "äta",
    definition: "to eat",
    distractors: ["to cook", "to serve", "to taste"],
    context: "Basic verb denoting eating food or snacks.",
    difficulty: "easy"
  },
  {
    word: "betyder",
    definition: "means or signifies",
    distractors: ["replaces or substitutes", "requires or demands", "prevents or blocks"],
    context: "Expresses the underlying meaning or symbolic importance of something.",
    difficulty: "easy"
  },

  // Fairy tale & Nature
  {
    word: "skog",
    definition: "dense forest or woods",
    distractors: ["open grassy meadow", "shallow freshwater lake", "rocky mountain slope"],
    context: "Extensive woodland covering a large portion of the Swedish countryside.",
    difficulty: "easy"
  },
  {
    word: "räv",
    definition: "fox",
    distractors: ["wolf", "bear", "lynx"],
    context: "A clever wild animal frequent in Scandinavian folklore.",
    difficulty: "easy"
  },
  {
    word: "nyfiken",
    definition: "curious or inquisitive",
    distractors: ["frightened or timid", "stubborn or defiant", "exhausted or weary"],
    context: "Eager to know, investigate, or discover new things.",
    difficulty: "easy"
  },
  {
    word: "sommardag",
    definition: "bright summer day",
    distractors: ["gloomy autumn night", "cold winter morning", "breezy spring evening"],
    context: "A pleasant warm day during the Scandinavian summer.",
    difficulty: "easy"
  },
  {
    word: "bestämde sig",
    definition: "made a decision",
    distractors: ["changed their mind", "forgot their plan", "asked for help"],
    context: "Reflexive verb indicating arriving at a firm resolution.",
    difficulty: "medium"
  },
  {
    word: "söka",
    definition: "to seek or search for",
    distractors: ["to defend or protect", "to escape or flee", "to guide or lead"],
    context: "To look actively for a person, location, or hidden object.",
    difficulty: "easy"
  },
  {
    word: "legendariska",
    definition: "legendary or mythical",
    distractors: ["ordinary and simple", "recently invented", "scientifically proven"],
    context: "Surrounded by historic fables, folklore, or great fame.",
    difficulty: "hard"
  },
  {
    word: "gyllene",
    definition: "golden or gleaming",
    distractors: ["shadowy or dark", "iron or metallic", "wooden or carved"],
    context: "Having the warm, shining color or brilliance of gold.",
    difficulty: "medium"
  },
  {
    word: "älg",
    definition: "moose or elk",
    distractors: ["reindeer", "wild boar", "brown bear"],
    context: "The iconic Swedish forest giant often dubbed the king of the forest.",
    difficulty: "easy"
  },
  {
    word: "bergets",
    definition: "of the mountain",
    distractors: ["of the river", "of the village", "of the coastline"],
    context: "Genitive form denoting possession or relation to a mountain.",
    difficulty: "easy"
  },
  {
    word: "uggla",
    definition: "owl",
    distractors: ["eagle", "falcon", "raven"],
    context: "A nocturnal bird of prey often symbolizing wisdom in stories.",
    difficulty: "easy"
  },
  {
    word: "kloka",
    definition: "wise or insightful",
    distractors: ["reckless or bold", "humorous or funny", "puzzling or odd"],
    context: "Displaying sound judgment, deep wisdom, or careful insight.",
    difficulty: "medium"
  },
  {
    word: "råd",
    definition: "advice or guidance",
    distractors: ["magic charms", "secret riddles", "silver coins"],
    context: "Suggestions or wisdom given to assist someone in a journey or dilemma.",
    difficulty: "easy"
  },

  // Society, Environment & Science
  {
    word: "samhälle",
    definition: "society or community",
    distractors: ["private enterprise", "educational campus", "geographical territory"],
    context: "The overarching social structure and community of citizens.",
    difficulty: "medium"
  },
  {
    word: "forskning",
    definition: "scientific research",
    distractors: ["industrial manufacturing", "political electioneering", "cultural preservation"],
    context: "Systematic investigation and academic study into a topic.",
    difficulty: "medium"
  },
  {
    word: "utveckling",
    definition: "development or progression",
    distractors: ["temporary stagnation", "sudden disruption", "gradual decline"],
    context: "The ongoing growth, maturation, or advancement of a process.",
    difficulty: "medium"
  },
  {
    word: "hållbarhet",
    definition: "sustainability",
    distractors: ["profitability", "accessibility", "competitiveness"],
    context: "Practices designed to protect ecological and economic longevity.",
    difficulty: "hard"
  },
  {
    word: "klimatförändringar",
    definition: "climate change effects",
    distractors: ["meteorological forecasts", "seasonal temperature swings", "renewable power projects"],
    context: "Long-term shifts in global temperatures and weather patterns.",
    difficulty: "hard"
  },
  {
    word: "beslut",
    definition: "formal decision or decree",
    distractors: ["general proposal", "informal inquiry", "public complaint"],
    context: "A conclusion or determination reached after consideration.",
    difficulty: "medium"
  },
  {
    word: "möjlighet",
    definition: "opportunity or possibility",
    distractors: ["inevitable obstacle", "strict requirement", "formal regulation"],
    context: "A favorable circumstance offering the chance to succeed.",
    difficulty: "medium"
  },
  {
    word: "ansvar",
    definition: "responsibility or duty",
    distractors: ["personal privilege", "legal exemption", "financial reward"],
    context: "The moral or legal duty to deal with something or have control over it.",
    difficulty: "medium"
  },
  {
    word: "framtid",
    definition: "future era or destiny",
    distractors: ["ancient heritage", "present situation", "forgotten memory"],
    context: "The time or a period of time following the moment of speaking or writing.",
    difficulty: "easy"
  },
  {
    word: "samarbete",
    definition: "collaboration or cooperation",
    distractors: ["intense competition", "unilateral decision", "isolated execution"],
    context: "Working together with others to achieve shared goals.",
    difficulty: "medium"
  },
  {
    word: "kunskap",
    definition: "knowledge or understanding",
    distractors: ["unproven rumor", "passing trend", "emotional instinct"],
    context: "Facts, information, and skills acquired through experience or education.",
    difficulty: "medium"
  },
  {
    word: "förändring",
    definition: "change or transformation",
    distractors: ["constant routine", "prolonged delay", "rigid tradition"],
    context: "The act or result of becoming different over time.",
    difficulty: "medium"
  },
  {
    word: "påverkan",
    definition: "influence or impact",
    distractors: ["indifference", "measurement", "separation"],
    context: "The effect that an action or phenomenon has on something else.",
    difficulty: "hard"
  },
  {
    word: "utmaning",
    definition: "challenge or obstacle",
    distractors: ["immediate victory", "effortless task", "lucky coincidence"],
    context: "A demanding or stimulating situation testing one's abilities.",
    difficulty: "medium"
  },
  {
    word: "upptäcka",
    definition: "to discover or uncover",
    distractors: ["to conceal or hide", "to overlook or miss", "to dismantle or ruin"],
    context: "To find something unexpectedly or in the course of a search.",
    difficulty: "medium"
  },
  {
    word: "berätta",
    definition: "to narrate or tell",
    distractors: ["to question or ask", "to listen silently", "to calculate rapidly"],
    context: "To relate a story, factual report, or personal experience.",
    difficulty: "easy"
  },
  {
    word: "förstå",
    definition: "to understand or comprehend",
    distractors: ["to misinterpret", "to ignore completely", "to dispute openly"],
    context: "To perceive the intended meaning or significance of something.",
    difficulty: "easy"
  },
  {
    word: "hjälpa",
    definition: "to assist or help",
    distractors: ["to burden or hinder", "to mislead or fool", "to refuse or reject"],
    context: "To make it easier for someone to do something by offering services or resources.",
    difficulty: "easy"
  },
  {
    word: "viktig",
    definition: "important or significant",
    distractors: ["trivial or minor", "outdated or old", "useless or vain"],
    context: "Carrying great value, consequence, or weight.",
    difficulty: "easy"
  },
  {
    word: "spännande",
    definition: "exciting or thrilling",
    distractors: ["monotonous or dull", "frightening or scary", "peaceful or quiet"],
    context: "Causing great excitement, intrigue, or eager interest.",
    difficulty: "medium"
  },
  {
    word: "självklart",
    definition: "self-evident or obvious",
    distractors: ["unlikely or doubtful", "strictly forbidden", "highly mysterious"],
    context: "Clear without explanation or argument.",
    difficulty: "medium"
  }
];

export function extractFallbackVocabulary(
  text: string,
  difficulty: "very_basic" | "beginner" | "intermediate" | "advanced" = "intermediate"
) {
  const lowerText = text.toLowerCase();
  
  // Clean tokens from text (removing punctuation)
  const tokens = lowerText
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const tokenSet = new Set(tokens);

  // Find exact and partial matches in our rich Swedish dictionary
  const matchedEntries: FallbackWordEntry[] = [];
  const seenWords = new Set<string>();

  for (const entry of SWEDISH_DICTIONARY) {
    const entryWord = entry.word.toLowerCase();
    
    // Exact word or stem match
    let isMatch = tokenSet.has(entryWord);
    if (!isMatch) {
      // Check multi-word (e.g. "stanna upp", "bestämde sig")
      if (entryWord.includes(" ") && lowerText.includes(entryWord)) {
        isMatch = true;
      } else {
        // Check inflected forms (e.g. skog -> skogen, skogar, räv -> räven)
        for (const token of tokenSet) {
          if (token.startsWith(entryWord) || entryWord.startsWith(token)) {
            isMatch = true;
            break;
          }
        }
      }
    }

    if (isMatch && !seenWords.has(entry.word)) {
      matchedEntries.push(entry);
      seenWords.add(entry.word);
    }
  }

  // If text has custom words not in dictionary, synthesize balanced options for the most salient tokens
  const nonStopwordTokens = tokens.filter((t) => {
    return !["och", "det", "som", "att", "var", "inte", "han", "hon", "den", "ett", "till", "med", "men", "har", "hade", "sig", "sin"].includes(t);
  });

  // Pick unique salient words if we have fewer than 7 matches
  for (const token of nonStopwordTokens) {
    if (matchedEntries.length >= 14) break;
    if (seenWords.has(token) || token.length < 4) continue;

    // Find capitalized or distinct word in original text
    const origRegex = new RegExp(`\\b(${token}\\w*)\\b`, "i");
    const match = text.match(origRegex);
    const displayWord = match ? match[1] : token;

    // Synthesize a credible entry
    const isLongCompound = displayWord.length > 9;
    const wordDiff: "easy" | "medium" | "hard" = isLongCompound ? "hard" : displayWord.length > 6 ? "medium" : "easy";

    matchedEntries.push({
      word: displayWord,
      definition: `key Swedish term (${displayWord})`,
      distractors: [
        `secondary aspect (${displayWord})`,
        `contrasting concept (${displayWord})`,
        `unrelated factor (${displayWord})`
      ],
      context: `Used in the passage as an important Swedish vocabulary component.`,
      difficulty: wordDiff
    });
    seenWords.add(token);
  }

  // Calibrate based on difficulty selection
  let selected = [...matchedEntries];

  if (difficulty === "very_basic") {
    // Progressive order: easy -> medium -> hard
    const easyWords = selected.filter((e) => e.difficulty === "easy");
    const medWords = selected.filter((e) => e.difficulty === "medium");
    const hardWords = selected.filter((e) => e.difficulty === "hard");

    // Combine in pedagogical sequence
    selected = [...easyWords, ...medWords, ...hardWords];
    if (selected.length < 8 && SWEDISH_DICTIONARY.length > 0) {
      // Add a few general core words if text was very brief
      for (const entry of SWEDISH_DICTIONARY) {
        if (!seenWords.has(entry.word)) {
          selected.push(entry);
          seenWords.add(entry.word);
          if (selected.length >= 12) break;
        }
      }
    }
  } else if (difficulty === "beginner") {
    // Prefer easy & medium words
    selected.sort((a, b) => {
      const rank = { easy: 1, medium: 2, hard: 3 };
      return rank[a.difficulty] - rank[b.difficulty];
    });
  } else if (difficulty === "intermediate") {
    // Prefer medium & hard
    selected.sort((a, b) => {
      const rank = { medium: 1, hard: 2, easy: 3 };
      return rank[a.difficulty] - rank[b.difficulty];
    });
  } else if (difficulty === "advanced") {
    // Prefer hard words first
    selected.sort((a, b) => {
      const rank = { hard: 1, medium: 2, easy: 3 };
      return rank[a.difficulty] - rank[b.difficulty];
    });
  }

  // Limit between 8 and 16 questions
  const finalEntries = selected.slice(0, 16);

  return finalEntries.map((item) => ({
    swedishWord: item.word,
    correctDefinition: item.definition,
    distractors: item.distractors,
    contextualExplanation: item.context,
    difficulty: item.difficulty
  }));
}
