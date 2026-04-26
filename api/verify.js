export default async function handler(req, res) {

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
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: `Fact-check this claim: ${claim}`
            }
          ],
          temperature: 0.2
        })
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error: "Server error",
      details: error.message
    });

  }

}
