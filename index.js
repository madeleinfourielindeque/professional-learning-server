const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(express.json());

// Allow Rise / browser access (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-api-key"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Professional Learning API is running" });
});

// Optional protected resources route
app.get("/api/resources", (req, res) => {
  const key = req.headers["x-api-key"];

  if (API_KEY && key !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  res.json([
    { id: 1, title: "Learning Design Basics" },
    { id: 2, title: "Facilitation Toolkit" }
  ]);
});

// Socratic Dyslexia endpoint for Rise
app.post("/api/socratic-dyslexia", (req, res) => {
  try {
    const key = req.headers["x-api-key"];

    if (API_KEY && key !== API_KEY) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const userMessages = messages.filter((m) => m.role === "user");
    const lastUserMessage = userMessages.length
      ? userMessages[userMessages.length - 1].content
      : "";

    const reply = generateSocraticReply(lastUserMessage, userMessages);

    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/socratic-dyslexia:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

// Socratic response logic
function generateSocraticReply(input, userMessages) {
  const text = (input || "").toLowerCase().trim();
  const turn = userMessages.length;

  if (!text) {
    return "What is one classroom moment that makes you think a learner may be experiencing difficulty with reading or written language?";
  }

  if (
    text.includes("diagnos") ||
    text.includes("does this student have dyslexia") ||
    text.includes("can i tell") ||
    text.includes("how do i know")
  ) {
    return "That’s an important concern, and classroom teachers do play a key role in noticing patterns. What specific reading, spelling, or writing behaviours could you document objectively before referring the student to your learning support team or a specialist for formal assessment?";
  }

  if (
    text.includes("backwards") ||
    text.includes("letters backwards") ||
    text.includes("revers")
  ) {
    return "You’re noticing something many people associate with dyslexia. What if letter reversals were only one visible behaviour rather than the core difficulty — what language-processing challenges might sit underneath the reading struggle?";
  }

  if (
    text.includes("phonological") ||
    text.includes("sounds") ||
    text.includes("decoding") ||
    text.includes("phonics")
  ) {
    return "Yes, you’re moving close to a key idea. If a student has difficulty connecting sounds to letters and letter patterns, how might that affect not only reading accuracy but also spelling and written expression?";
  }

  if (
    text.includes("fluency") ||
    text.includes("slow reading") ||
    text.includes("processing speed")
  ) {
    return "That’s a thoughtful observation. If reading takes far more effort and time, what might happen to the student’s working memory, stamina, and confidence during a typical classroom task?";
  }

  if (
    text.includes("spelling") ||
    text.includes("writing") ||
    text.includes("written work")
  ) {
    return "Absolutely — dyslexia often shows up beyond reading alone. How might spelling and writing demands increase cognitive load, even when the student understands the content quite well?";
  }

  if (
    text.includes("memory") ||
    text.includes("working memory")
  ) {
    return "That’s a useful connection. If a learner is using a lot of mental effort just to decode words, what happens to the capacity left for remembering instructions, organising ideas, or answering questions?";
  }

  if (
    text.includes("adjustment") ||
    text.includes("accommodation") ||
    text.includes("support") ||
    text.includes("help")
  ) {
    return "You’re already thinking in a practical direction. Which adjustment would reduce the literacy barrier without lowering the intellectual challenge: extra time, text-to-speech, oral response options, chunked instructions, or something else?";
  }

  if (
    text.includes("assessment") ||
    text.includes("test") ||
    text.includes("exam")
  ) {
    return "That raises an important fairness question. How could you design or adjust assessment so the student is demonstrating their understanding of the content, rather than being blocked mainly by reading and spelling demands?";
  }

  if (
    text.includes("confidence") ||
    text.includes("anxiety") ||
    text.includes("self-esteem")
  ) {
    return "Yes — the emotional dimension matters a great deal. If a student repeatedly experiences difficulty in visible literacy tasks, how might that shape participation, risk-taking, and their sense of themselves as a learner?";
  }

  if (turn === 1) {
    return "That’s a thoughtful starting point. What makes that challenge particularly significant for a student with dyslexia, and how might it affect their experience of learning across the school day?";
  }

  if (turn === 2) {
    return "You’re beginning to unpack both the learning demand and the learner experience. If that difficulty appeared in your classroom tomorrow, what is one adjustment you could make immediately that would remove a barrier without reducing expectations?";
  }

  if (turn === 3) {
    return "That shows strong professional judgement. How would you know whether that adjustment was genuinely helping the student access the learning, rather than simply making the task easier?";
  }

  if (turn >= 4 && turn <= 6) {
    return "You’re building a nuanced understanding here. Looking across reading, spelling, working memory, and confidence, which area do you think teachers most often overlook when supporting students with dyslexia, and why?";
  }

  return "That’s a valuable reflection. If you were to translate that insight into one concrete classroom practice this week, what would you try first, and what would you watch for in the student’s response?";
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
