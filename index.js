// import fetch from "node-fetch";
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// // Optional: Handle preflight for custom headers or methods (if needed)
// app.options("*", cors());

// app.use("/shipstation", async (req, res) => {
//   const proxyPath = req.originalUrl.replace(/^\/shipstation/, "");
//   const shipstationUrl = `https://ssapi.shipstation.com${proxyPath}`;

//   try {
//     const authString = Buffer.from(
//       `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`
//     ).toString("base64");

//     const headers = {
//       Authorization: `Basic ${authString}`,
//     };

//     const hasBody = ["POST", "PUT", "DELETE"].includes(req.method);
//     if (hasBody) {
//       headers["Content-Type"] = "application/json";
//     }

//     const options = {
//       method: req.method,
//       headers,
//       body: hasBody ? JSON.stringify(req.body) : undefined,
//     };

//     const response = await fetch(shipstationUrl, options);
//     // console.log("response", response);

//     const contentType = response.headers.get("content-type");
//     const text = await response.text();

//     let data;
//     try {
//       data = contentType?.includes("application/json")
//         ? JSON.parse(text)
//         : text;
//       console.log("data", data);
//     } catch (error) {
//       console.error("❌ Failed to parse response JSON:", text);
//       return res.status(response.status).send(text);
//     }

//     res.status(response.status).json(data);
//   } catch (err) {
//     console.error("🚨 Error in proxy:", err);
//     res.status(500).send("Proxy error Internal Server Error");
//   }
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running at http://localhost:${port}`);
// });

// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyRoute } from "./proxyFactor.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.options("*", cors()); // Optional for preflight support

// 🚚 ShipStation Proxy Route
app.use(
  "/shipstation",
  createProxyRoute({
    baseUrl: "https://ssapi.shipstation.com",
    getHeaders: async () => {
      const auth = Buffer.from(
        `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`
      ).toString("base64");

      return {
        Authorization: `Basic ${auth}`,
      };
    },
  })
);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
