export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { claim } = req.body;

  if (!claim) {
    return res.status(400).json({ error: "Claim is required" });
  }

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `
You are an expert fact-checker AI.

Always respond ONLY in valid JSON format like this:

{
  "verdict": "True" | "False" | "Uncertain",
  "explanation": "2-4 sentence explanation",
  "source_type": "government" | "research" | "news" | "mixed",
  "credibility_score": number between 0 and 100,
  "sources_used": ["source1", "source2", "source3"]
}
`
            },
            {
              role: "user",
              content: `Fact-check this claim: "${claim}"`
            }
          ]
        })
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error: "Verification failed",
      details: error.message
    });

  }

}
