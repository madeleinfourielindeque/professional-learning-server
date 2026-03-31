const express = require("express");
const topicPacks = require("./topicPacks");

const app = express();
const PORT = process.env.PORT || 3000;
const AGENT_API_KEY = process.env.AGENT_API_KEY;

// Middleware
app.use(express.json());

// CORS for Rise / browser access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key");
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

// Main Professional Learning Guide endpoint
app.post("/api/professional-learning-guide", (req, res) => {
  try {
    const key = req.headers["x-api-key"];

    if (AGENT_API_KEY && key !== AGENT_API_KEY) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    const { topicId, messages } = req.body;

    if (!topicId) {
      return res.status(400).json({ error: "topicId is required." });
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const pack = topicPacks[topicId];

    if (!pack) {
      return res.status(400).json({ error: `Unknown topicId: ${topicId}` });
    }

    const userMessages = messages.filter((m) => m.role === "user");
    const lastUserMessage = userMessages.length
      ? userMessages[userMessages.length - 1].content
      : "";

    const reply = generateProfessionalLearningReply(lastUserMessage, userMessages, pack);

    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/professional-learning-guide:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

function generateProfessionalLearningReply(input, userMessages, pack) {
  const text = (input || "").toLowerCase().trim();
  const turn = userMessages.length;

  if (!text) {
    return pack.starterQuestion;
  }

  if (
    text.includes("diagnos") ||
    text.includes("does this student have") ||
    text.includes("how do i know") ||
    text.includes("can i tell")
  ) {
    return `That’s an important concern. Within ${pack.topicTitle.toLowerCase()}, what kinds of observations could an educator document carefully before moving toward referral or specialist support?`;
  }

  if (
    text.includes("help") ||
    text.includes("support") ||
    text.includes("adjust") ||
    text.includes("respond") ||
    text.includes("strategy")
  ) {
    return `You’re moving toward practice, which is where this becomes useful. In ${pack.topicTitle.toLowerCase()}, what is one response, adjustment, or design move that could support the learner while staying within professional boundaries?`;
  }

  if (
    text.includes("misunderstand") ||
    text.includes("myth") ||
    text.includes("assume") ||
    text.includes("belief")
  ) {
    return `That opens an important line of thinking. What common assumption in ${pack.topicTitle.toLowerCase()} might need to be questioned or reframed?`;
  }

  if (
    text.includes("behaviour") ||
    text.includes("disengage") ||
    text.includes("shutdown") ||
    text.includes("escalat") ||
    text.includes("avoid")
  ) {
    return `That sounds significant. Which interpretation feels most worth exploring first here: stress, overload, confusion, disconnection, uncertainty, or something else?`;
  }

  if (
    text.includes("classroom") ||
    text.includes("teaching") ||
    text.includes("practice") ||
    text.includes("lesson")
  ) {
    return `You’re connecting the issue to practice, which is important. What would this look like not just as an idea, but as a concrete move in the classroom?`;
  }

  if (turn === 1) {
    return `That’s a thoughtful starting point. In ${pack.topicTitle.toLowerCase()}, what makes that issue especially significant for educator practice?`;
  }

  if (turn === 2) {
    return `You’re starting to clarify the challenge. Which idea feels most relevant here: ${pack.keyIdeas.slice(0, 3).join(", ")}?`;
  }

  if (turn === 3) {
    return `That gives the issue more shape. What might this mean for day-to-day practice, not just understanding in theory?`;
  }

  if (turn === 4) {
    return `That’s a useful insight. What would sit clearly within an educator’s role here, and what might need referral, specialist support, or formal processes?`;
  }

  if (turn === 5) {
    return `You’re building a strong reflection. If staff took one practical step after this learning, what would you most want them to notice, try, or change?`;
  }

  return `That’s a valuable insight. If you turned this into one practical next step for staff, what would you want them to do differently in practice?`;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
