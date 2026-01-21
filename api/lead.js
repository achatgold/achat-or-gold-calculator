export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Only accept JSON
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("application/json")) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  // Optional: allow only your domain(s)
  const origin = req.headers.origin || "";
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (allowedOrigins.length && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  // Forward to Google Apps Script (secret is sent from server, not browser)
  const resp = await fetch(process.env.GAS_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AOM-SECRET": process.env.WEBHOOK_SECRET,
    },
    body: JSON.stringify(req.body),
  });

  const text = await resp.text();
  return res.status(resp.status).send(text);
}
