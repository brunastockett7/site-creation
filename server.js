/* eslint-env node */
/* eslint-disable no-undef */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

// controllers + routes (all lowercase paths)
const inventoryroute = require('./routes/inventoryroute');
const basecontroller = require('./controllers/basecontroller');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"], // add "'unsafe-inline'" if you use inline <script>
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

// Show the 500 trigger link only on inventory pages (/inv/*)
// (Change the condition to req.path === '/' if you prefer Home-only)
app.use((req, res, next) => {
  res.locals.showErrorLink = req.path.startsWith('/inv');
  next();
});

// ------------------- ROUTES -------------------

// Home (MVC via controller)
app.get('/', basecontroller.buildHome);

// Inventory (MVC)
app.use('/inv', inventoryroute);

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

// ------------------- ERROR HANDLERS -------------------

// 404 - Not Found (required by rubric)
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Not Found',
    status: 404,
    message: 'Page not found'
  });
});

// 500 - Server Error (required by rubric)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).render('error', {
    title: 'Server Error',
    status: 500,
    message: 'Something went wrong on the server.'
  });
});

// ------------------- START SERVER -------------------

const PORT = process.env.PORT || 3000; // set PORT=5500 in .env if your course expects 5500
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
