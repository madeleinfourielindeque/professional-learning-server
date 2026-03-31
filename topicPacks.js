const topicPacks = {
  dyslexia: {
    topicId: "dyslexia",
    topicTitle: "Understanding Dyslexia in the Classroom",
    audience: "Teachers and support staff",
    learningFocus:
      "Help educators understand how dyslexia affects learning and how classroom adjustments can reduce barriers without lowering challenge.",

    starterQuestion:
      "When you think about a student with dyslexia in your classroom, what learning task might feel most difficult for them, and why?",

    keyIdeas: [
      "phonological processing",
      "decoding",
      "reading fluency",
      "spelling",
      "written expression",
      "working memory",
      "processing speed",
      "cognitive load",
      "structured literacy",
      "reasonable adjustments"
    ],

    commonMisconceptions: [
      "dyslexia means seeing letters backwards",
      "dyslexia is a sign of low intelligence",
      "students with dyslexia just need to try harder",
      "if a student can speak well, reading difficulties are probably minor"
    ],

    classroomImplications: [
      "provide explicit, structured literacy support",
      "reduce unnecessary reading load where appropriate",
      "offer alternative ways to demonstrate understanding",
      "use assistive technology where helpful",
      "chunk instructions and reduce overload",
      "allow extra time when literacy load is high"
    ],

    boundaries: [
      "do not diagnose dyslexia",
      "do not label a student as having dyslexia based on classroom observation alone",
      "do not replace formal assessment or specialist advice"
    ],

    referralGuidance:
      "If concerns are ongoing or significant, staff should document patterns in reading, spelling, and writing, then refer through the school’s learning support processes or appropriate specialist pathways.",

    resources: [
      {
        label: "Dyslexia Association of Australia",
        url: "https://dyslexiaassociation.org.au/what-is-dyslexia/"
      },
      {
        label: "Dyslexia-SPELD Foundation",
        url: "https://dsf.net.au/resources/downloadable-resources"
      },
      {
        label: "Queensland Reading and Writing Centre",
        url: "https://readingwritingcentre.education.qld.gov.au/reading-and-writing-disorders/dyslexia"
      }
    ],

    promptHints: {
      understanding:
        "What might educators need to understand more clearly about how dyslexia affects classroom learning?",
      misconception:
        "What assumption or common misunderstanding might need to be gently challenged here?",
      practice:
        "What classroom adjustment or teaching move could reduce barriers while maintaining expectations?",
      boundaries:
        "What sits within an educator’s role here, and what may require referral or specialist support?",
      transfer:
        "What is one thing a teacher could do differently this week because of this insight?"
    }
  },

  "trauma-informed-practice": {
    topicId: "trauma-informed-practice",
    topicTitle: "Trauma-Informed Practice",
    audience: "Teachers, youth workers, and school support staff",
    learningFocus:
      "Help educators understand how trauma can affect behaviour, regulation, relationships, and learning, and how trauma-informed practice can support engagement and safety.",

    starterQuestion:
      "When a student’s behaviour seems extreme, shut down, or hard to predict, what might be happening beneath the behaviour rather than only in the behaviour?",

    keyIdeas: [
      "safety",
      "regulation",
      "co-regulation",
      "predictability",
      "relational practice",
      "behaviour as communication",
      "stress responses",
      "classroom environment",
      "repair and reconnection"
    ],

    commonMisconceptions: [
      "challenging behaviour is simply defiance",
      "consequences alone will fix dysregulation",
      "a calm-looking student is always coping well",
      "trauma-informed practice means lowering expectations"
    ],

    classroomImplications: [
      "create predictable routines",
      "use a calm and non-escalating tone",
      "prioritise relational safety",
      "avoid unnecessary public correction",
      "support regulation before expecting reasoning",
      "focus on repair after conflict"
    ],

    boundaries: [
      "do not diagnose trauma",
      "do not act as a therapist or counsellor",
      "do not investigate disclosures beyond school processes",
      "do not replace wellbeing or safeguarding procedures"
    ],

    referralGuidance:
      "If a student’s presentation raises wellbeing or safety concerns, staff should follow school wellbeing, safeguarding, and referral procedures.",

    resources: [
      {
        label: "Trauma-informed practice resources",
        url: "https://traumaawareschools.org/"
      }
    ],

    promptHints: {
      understanding:
        "What might this behaviour or response be communicating about stress, safety, or regulation?",
      misconception:
        "What interpretation might adults jump to too quickly in this kind of situation?",
      practice:
        "What response would increase safety, predictability, or co-regulation here?",
      boundaries:
        "What is the educator’s role in responding supportively, and what requires referral or formal support?",
      transfer:
        "What is one trauma-informed adjustment a staff member could make in their practice this week?"
    }
  },

  "youth-mental-health": {
    topicId: "youth-mental-health",
    topicTitle: "Supporting Youth Mental Health",
    audience: "Teachers, youth workers, and school support staff",
    learningFocus:
      "Help educators recognise when a student may need support, respond in appropriate and boundaried ways, and understand when referral is necessary.",

    starterQuestion:
      "What kinds of changes in a young person’s behaviour, mood, engagement, or relationships might make you concerned about their wellbeing?",

    keyIdeas: [
      "noticing change over time",
      "wellbeing and mental health",
      "supportive conversations",
      "professional boundaries",
      "referral pathways",
      "protective factors",
      "stigma reduction",
      "early support"
    ],

    commonMisconceptions: [
      "teachers need to fix the issue themselves",
      "mental health concerns are always obvious",
      "bringing up concern will make things worse",
      "withdrawal always means disengagement rather than distress"
    ],

    classroomImplications: [
      "notice patterns and changes over time",
      "respond calmly and supportively",
      "listen without overpromising confidentiality",
      "document concerns appropriately",
      "refer through wellbeing pathways when needed",
      "maintain classroom inclusion and dignity"
    ],

    boundaries: [
      "do not diagnose a mental health condition",
      "do not provide counselling beyond role boundaries",
      "do not manage serious concerns outside school procedures"
    ],

    referralGuidance:
      "If concerns are significant, persistent, or safety-related, staff should follow school wellbeing, counselling, and safeguarding procedures immediately.",

    resources: [
      {
        label: "headspace",
        url: "https://headspace.org.au/"
      },
      {
        label: "Be You",
        url: "https://beyou.edu.au/"
      }
    ],

    promptHints: {
      understanding:
        "What changes might be most important to notice in a student’s presentation over time?",
      misconception:
        "What assumption might adults make that could cause them to miss or minimise concern?",
      practice:
        "What would a supportive and professionally appropriate response look like here?",
      boundaries:
        "What is within an educator’s role, and what needs referral to wellbeing or specialist support?",
      transfer:
        "What is one thing a staff member could notice, say, or do differently after this learning?"
    }
  }
};

module.exports = topicPacks;
