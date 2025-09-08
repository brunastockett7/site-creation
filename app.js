/* eslint-env node */
/* eslint-disable no-console */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

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
app.set('layout', 'layout'); // your layout file is layout.ejs

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'CSE Motors — Home',
    description: 'Shop, finance, and service with transparent pricing.',
  });
});

app.get('/inventory', (req, res) => {
  res.render('inventory', {
    title: 'Inventory — CSE Motors',
    description: 'Browse cars with photos, details, and prices.',
  });
});

app.get('/finance', (req, res) => {
  res.render('finance', {
    title: 'Finance — CSE Motors',
    description: 'Financing requirements for CSE Motors. Get pre-approved with the documents listed here.',
  });
});

app.get('/service', (req, res) => {
  res.render('service', {
    title: 'Service — CSE Motors',
    description: 'Quotes and booking for maintenance and repairs.',
  });
});

// Health check
app.get('/health', (_req, res) => res.status(200).send('OK'));

// Error handler (prevent crashes)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
