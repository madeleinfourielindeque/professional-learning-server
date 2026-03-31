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

// Main Professional Learning Guide endpoint
app.post("/api/professional-learning-guide", (req, res) => {
  try {
    const key = req.headers["x-api-key"];

    if (AGENT_API_KEY && key !== AGENT_API_KEY) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    const { topicId, messages, interactionType } = req.body;

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

    const reply = generateProfessionalLearningReply(
      lastUserMessage,
      userMessages,
      pack,
      interactionType || "typed"
    );

    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/professional-learning-guide:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

function generateProfessionalLearningReply(input, userMessages, pack, interactionType) {
  const text = (input || "").toLowerCase().trim();
  const turn = userMessages.length;

  // Starter
  if (!text) {
    return pack.starterQuestion;
  }

  // Explicit finish flow
  if (interactionType === "finish") {
    return `Before we finish, what is one idea from this conversation that feels most important for your own practice or understanding of ${pack.topicTitle.toLowerCase()}?`;
  }

  // Final closing message
  if (interactionType === "closing") {
    return "Thank you. That reflection captures an important professional insight. As you finish up this module, keep that idea in mind and consider how it might shape your practice in real situations.";
  }

  // Quick prompt flow: brief answer + reflective question
  if (interactionType === "quick-prompt") {
    return generateQuickPromptReply(text, pack);
  }

  // Automatic move toward closure after several turns
  if (turn === 5) {
    return `You’ve explored several important ideas here about ${pack.topicTitle.toLowerCase()}. What is one practical insight you are taking from this conversation so far?`;
  }

  if (turn === 6) {
    return "That sounds like a meaningful takeaway. How might that insight influence something you do, notice, or change in your practice?";
  }

  if (turn >= 7) {
    return "Thank you. That reflection captures an important professional insight. As you finish up this module, keep that idea in mind and consider how it might shape your practice in real situations.";
  }

  // Topic-sensitive prompt handling
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
    text.includes("misconception") ||
    text.includes("myth") ||
    text.includes("assume") ||
    text.includes("belief")
  ) {
    return `That opens an important line of thinking. What common assumption in ${pack.topicTitle.toLowerCase()} might need to be questioned or reframed?`;
  }

  if (
    text.includes("behaviour") ||
    text.includes("disengage") ||
    text.includes("disengaged") ||
    text.includes("shutdown") ||
    text.includes("shut down") ||
    text.includes("escalat") ||
    text.includes("avoid")
  ) {
    return "That sounds significant. Which interpretation feels most worth exploring first here: stress, overload, confusion, disconnection, uncertainty, or something else?";
  }

  if (
    text.includes("classroom") ||
    text.includes("teaching") ||
    text.includes("practice") ||
    text.includes("lesson")
  ) {
    return "You’re connecting the issue to practice, which is important. What would this look like not just as an idea, but as a concrete move in the classroom?";
  }

  if (
    text.includes("referral") ||
    text.includes("refer") ||
    text.includes("specialist") ||
    text.includes("learning support")
  ) {
    return `That brings in an important professional boundary. What observations or patterns would help clarify when classroom support is enough and when referral or specialist input may be needed?`;
  }

  // Turn-based Socratic flow
  if (turn === 1) {
    return `That’s a thoughtful starting point. In ${pack.topicTitle.toLowerCase()}, what makes that issue especially significant for educator practice?`;
  }

  if (turn === 2) {
    return `You’re starting to clarify the challenge. Which idea feels most relevant here: ${pack.keyIdeas.slice(0, 3).join(", ")}?`;
  }

  if (turn === 3) {
    return "That gives the issue more shape. What might this mean for day-to-day practice, not just understanding in theory?";
  }

  if (turn === 4) {
    return "That’s a useful insight. What would sit clearly within an educator’s role here, and what might need referral, specialist support, or formal processes?";
  }

  return "That’s a valuable insight. If you turned this into one practical next step for staff, what would you want them to do differently in practice?";
}

function generateQuickPromptReply(text, pack) {
  if (pack.topicId === "dyslexia") {
    if (text.includes("misconception")) {
      return "A common misconception is that dyslexia mainly means seeing letters backwards. In practice, dyslexia is more closely associated with difficulties in phonological processing, decoding, spelling, and reading fluency. Which misconception do you think has the biggest impact on classroom expectations or teacher responses?";
    }

    if (text.includes("adjustment")) {
      return "Useful classroom adjustments might include reducing unnecessary reading load, allowing alternative ways to show understanding, chunking instructions, using assistive technology, and giving extra time when literacy demands are high. The aim is to reduce barriers without lowering the cognitive challenge of the learning. Which of those adjustments feels most realistic in your context?";
    }

    if (
      text.includes("reading") ||
      text.includes("spelling") ||
      text.includes("written expression") ||
      text.includes("learning impacts")
    ) {
      return "Dyslexia can affect much more than reading aloud. Students may need more effort for decoding, spelling, and written expression, which can increase cognitive load and reduce working memory available for the task itself. How might that change the way you interpret a student’s pace, confidence, or written output?";
    }

    if (
      text.includes("teacher role") ||
      text.includes("role and referral") ||
      text.includes("referral") ||
      text.includes("referred")
    ) {
      return "A teacher’s role includes noticing patterns, documenting classroom observations, adjusting instruction where appropriate, and referring concerns through school support processes. It does not include diagnosing dyslexia or replacing specialist assessment. What kinds of observations would be most useful to document before referral?";
    }
  }

  if (pack.topicId === "engagement-and-regulation") {
    if (text.includes("misconception")) {
      return "A common misconception is that disengagement always means laziness or defiance. In many cases, disengagement may reflect overload, uncertainty, dysregulation, stress, or a low sense of safety and success in the task. Which of those possibilities do you think staff are most likely to overlook?";
    }

    if (text.includes("adjustment") || text.includes("support")) {
      return "Supportive responses can include chunking tasks, reducing overload, offering achievable entry points, using calm and predictable language, and strengthening relational safety before pushing for compliance. These moves support both regulation and engagement. Which of those feels most transferable to everyday practice?";
    }

    if (
      text.includes("impact") ||
      text.includes("engagement") ||
      text.includes("regulation")
    ) {
      return "Regulation and engagement are closely connected. If a student is overwhelmed, dysregulated, or uncertain, their capacity to participate, persist, and think clearly can drop significantly. How might that change the way you interpret what looks like non-participation?";
    }

    if (text.includes("role") || text.includes("referral")) {
      return "An educator’s role includes noticing patterns, adjusting the environment, supporting regulation, and documenting concerns where needed. More significant or persistent patterns may need wider school support, wellbeing processes, or referral. What signs would tell you that broader support may be needed?";
    }
  }

  if (pack.topicId === "trauma-informed-practice") {
    if (text.includes("misconception")) {
      return "A common misconception is that trauma-informed practice means lowering expectations or excusing behaviour. In reality, it is about responding in ways that increase safety, regulation, and connection so students are more able to engage. How might that shift the way staff interpret a challenging moment?";
    }

    if (text.includes("adjustment") || text.includes("support")) {
      return "Trauma-informed adjustments often include predictable routines, calm tone, relational safety, reduced public correction, and support for regulation before reasoning. These approaches do not remove boundaries, but they change how those boundaries are enacted. Which of those feels most relevant in your context?";
    }

    if (text.includes("impact") || text.includes("behaviour")) {
      return "Trauma can affect regulation, sense of safety, attention, trust, and response to stress. That means behaviour may be shaped by survival responses rather than deliberate opposition alone. What difference might that make to the way a staff member responds in the moment?";
    }

    if (text.includes("role") || text.includes("referral")) {
      return "An educator’s role includes noticing patterns, responding in supportive and boundaried ways, and following school wellbeing and safeguarding processes. It does not include diagnosing trauma or acting as a therapist. What would appropriate support look like within that role?";
    }
  }

  if (pack.topicId === "youth-mental-health") {
    if (text.includes("misconception")) {
      return "A common misconception is that mental health concerns are always obvious or that raising concern will make things worse. Often, the more important skill is noticing change over time and responding calmly and appropriately. What signs do you think adults may be most likely to miss?";
    }

    if (text.includes("adjustment") || text.includes("support")) {
      return "Supportive responses can include noticing changes, listening calmly, maintaining dignity, making appropriate adjustments where possible, and referring concerns through the right pathways. The goal is not to solve everything, but to respond well within role boundaries. Which part of that feels most important in practice?";
    }

    if (text.includes("impact") || text.includes("wellbeing")) {
      return "Mental health concerns can affect concentration, attendance, energy, relationships, motivation, and sense of belonging. That means a change in learning behaviour may sometimes be connected to wellbeing rather than effort alone. How might that influence your interpretation of what you see in class?";
    }

    if (text.includes("role") || text.includes("referral")) {
      return "An educator’s role includes noticing, listening, documenting concerns appropriately, and referring through school wellbeing or safeguarding processes. It does not include diagnosis or counselling beyond professional boundaries. What would you want staff to feel confident doing within that role?";
    }
  }

  return `Here’s a useful starting point for ${pack.topicTitle.toLowerCase()}: ${pack.learningFocus} What part of that feels most relevant to your own setting or practice?`;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
