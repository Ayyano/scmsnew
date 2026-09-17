const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));

/*
|--------------------------------------------------------------------------
| SPA Entry
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.render("index", {
    appName: "SCMS",
    schoolName: "KPK School Management System"
  });
});

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.json({
    success: true,
    application: "KPK School Management System",
    status: "online",
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| Netlify / SPA Fallback
|--------------------------------------------------------------------------
*/

app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/health") ||
    req.path.includes(".")
  ) {
    return next();
  }

  res.render("index", {
    appName: "SCMS",
    schoolName: "KPK School Management System"
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

/*
|--------------------------------------------------------------------------
| Local Development
|--------------------------------------------------------------------------
|
| Netlify does not require a permanently running Express server.
| For local development:
|
| npm install
| npm start
|
|--------------------------------------------------------------------------
*/

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SCMS running at http://localhost:${PORT}`);
  });
}

module.exports = app;
