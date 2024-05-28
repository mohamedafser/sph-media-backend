// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// const app = express();
// const port = process.env.port || 5000;
// app.use(cors());

// app.get("/api", (req, res) => {
//   const filePath = path.join(__dirname, "server", "hdb-resale-2023.csv");

//   const output = fs
//     .readFileSync(filePath, { encoding: "utf8", flag: "r" })
//     .toString()
//     .split("\n");
//   const fres = output.reduce((acc, curr, i) => {
//     let key = output[0].split(",");

//     if (i > 0) {
//       let val = curr.split(",");
//       let obj = {};
//       val.forEach((element, index) => {
//         obj[key[index].trim()] = element.trim();
//       });
//       acc.push(obj);
//     }

//     return acc;
//   }, []);

//   res.json(fres);
// });

// app.listen(port, () => {
//   console.log("Example app listening on port", port);
// });

const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Define path to CSV file
const filePath = path.join(__dirname, "server", "hdb-resale-2023.csv");

// Read CSV file and convert to JSON
const parseCSV = () => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// Define route to serve JSON data
app.get("/api", async (req, res) => {
  try {
    const data = await parseCSV();
    res.json(data);
  } catch (error) {
    console.error("Error reading CSV:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on port", port);
});
