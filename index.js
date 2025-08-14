import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logApp from "./logServer.js";
import { createProxyRoute } from "./proxyFactor.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(logApp);
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use(
  "/shipstation",
  createProxyRoute({
    baseUrl: "https://ssapi.shipstation.com",
    // baseUrl: "https://docs.shipstation.com/_mock/openapi/v2",
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
