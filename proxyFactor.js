import fetch from "node-fetch";

export function createProxyRoute({ baseUrl, getHeaders }) {
  console.log(`Creating proxy route for base URL: ${baseUrl}`);
  return async (req, res) => {
    const proxyPath = req.originalUrl.replace(req.baseUrl, "");
    const targetUrl = `${baseUrl}${proxyPath}`;
    console.log(targetUrl, "targetUrl");

    try {
      const headers = await getHeaders(req);
      const hasBody = ["POST", "PUT", "DELETE"].includes(req.method);

      if (hasBody) {
        headers["Content-Type"] = "application/json";
      }

      const options = {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      };

      const response = await fetch(targetUrl, options);
      const contentType = response.headers.get("content-type");
      const text = await response.text();

      let data;
      try {
        data = contentType?.includes("application/json")
          ? JSON.parse(text)
          : text;
        console.log("✅ ShipStation Response:", data);
      } catch (err) {
        console.error("❌ Failed to parse response JSON:", text);
        return res.status(response.status).send(text);
      }

      res.status(response.status).json(data);
    } catch (err) {
      console.error("🚨 Proxy error:", err);
      res.status(500).send("Proxy error Internal Server Error");
    }
  };
}
