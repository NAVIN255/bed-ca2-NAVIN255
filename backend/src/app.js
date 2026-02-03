const express = require("express");
const cors = require("cors");

const path = require("path");

const app = express();

// ✅ CORS MUST BE FIRST (before routes)
app.use(cors());

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// locals middleware (your existing logic)
app.use((req, res, next) => {
    res.locals.next = false;
    res.locals.verification = true;
    next();
});

// routes
const mainRoutes = require("./routes/mainRoutes");
app.use("/api", mainRoutes);

// static files (optional)
app.use("/", express.static(path.join(__dirname, "../../frontend")));

module.exports = app;
