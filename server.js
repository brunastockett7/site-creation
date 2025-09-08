/* eslint-env browser */
/* eslint-disable no-undef */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Security middleware
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

// Logger
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// EJS view engine with layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

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
    description: 'See requirements and steps to get financed.',
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
