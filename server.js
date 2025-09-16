/* eslint-env browser */
/* eslint-disable no-undef */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

// 👇 add controllers + routes
const inventoryRoute = require("./routes/inventoryroute");
const { home, buildNavData } = require("./controllers/basecontroller");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
      },
    },
  })
);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// 👇 make nav available to all views
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await buildNavData();
    next();
  } catch (e) {
    next(e);
  }
});

// ------------------- ROUTES -------------------

// Home (dynamic, with nav)
app.get("/", home);

// Inventory (MVC)
app.use("/inv", inventoryRoute);

// Keep your static finance/service routes
app.get('/finance', (req, res) => {
  res.render('finance', {
    title: 'Finance — CSE Motors',
    description: 'See requirements and steps to get financed.',
  });
});

app.get('/service', (req, res) => {
  res.render('service', {
    title: 'Service — CSE Motors',
    description: 'Quotes and booking for maintenance and repairs.',
  });
});

// health check
app.get('/health', (_req, res) => res.status(200).send('OK'));

// error handler (so template errors don’t crash the process)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
