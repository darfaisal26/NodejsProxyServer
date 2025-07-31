import express from "express";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);
const logApp = express();
const LOG_FILE_PATH = path.join(__dirname, "log.txt");

// Middleware to log every request to log.txt
logApp.use((req, res, next) => {
  const date = new Date();

  // Month, Day & Weekday names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Extract parts
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const weekday = dayNames[date.getDay()];

  // 12-hour formatting
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  hours = hours.toString().padStart(2, "0");

  const time = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Final formatted log timestamp
  const logDate = `${month} ${day}, ${year} (${weekday}) ${time}`;
  //   console.log(logDate);

  const logEntry = `${logDate} ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(LOG_FILE_PATH, logEntry, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
  next();
});

// Endpoint to retrieve logs
logApp.get("/logs", (req, res) => {
  fs.readFile(LOG_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading log file");
    } else {
      res.set("Content-Type", "text/plain").send(data);
    }
  });
});

export default logApp;
