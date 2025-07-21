// index.js
import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Update this for production
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Proxy all requests starting with /shipstation
app.use("/shipstation", async (req, res) => {
  const proxyPath = req.originalUrl.replace("/shipstation", "");
  const shipstationUrl = `https://ssapi.shipstation.com${proxyPath}`;

  console.log(proxyPath);
  console.log(shipstationUrl);
  console.log(req.url);
  console.log(req.body);
  try {
    const response = await fetch(shipstationUrl, {
      method: req.method,
      headers: {
        Authorization: process.env.SHIPSTATION_API_KEY,
        "Content-Type": "application/json",
      },
      body: ["POST", "PUT", "DELETE"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await response.json();
    const responseText = await response.text();
    console.log("ShipStation Raw Response Status:", response.status);
    console.log("ShipStation Raw Response Body:", responseText);
    // --- END DEBUGGING ---

    if (response.ok && responseText) {
      try {
        const data = JSON.parse(responseText); // Manually parse the text
        console.log(data, "datatatt");
        res.status(response.status).json(data);
      } catch (jsonParseError) {
        console.error(
          "Error parsing ShipStation response as JSON:",
          jsonParseError
        );
        res
          .status(500)
          .send(
            "Error: ShipStation returned non-JSON content or malformed JSON."
          );
      }
    } else {
      // If response is not OK or has no content, send the raw text or a default message
      console.warn(
        `ShipStation did not return a successful response (Status: ${response.status}).`
      );
      res
        .status(response.status)
        .send(
          responseText ||
            `ShipStation returned status ${response.status} with no content.`
        );
    }
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Error in proxy:", err);
    res.status(500).send("Proxy error comng");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
