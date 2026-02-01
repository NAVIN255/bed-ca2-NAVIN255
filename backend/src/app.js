const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.next = false;
    res.locals.verification = true;
    next();
});

// Fixed require path
const mainRoutes = require('./routes/mainRoutes');
app.use("/api", mainRoutes);

app.use("/", express.static('public'));

module.exports = app;
