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
    console.log(data, "datatatt");
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Error in proxy:", err);
    res.status(500).send("Proxy error comng");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
