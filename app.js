/* eslint-env node */
/* eslint-disable no-console */

// app.js  (Node server)
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Serve static files (MUST be before routes)
app.use(express.static(path.join(__dirname, 'public')));

// 2) View engine + layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout'); // views/layout.ejs

// 3) Routes (render content-only views)
app.get('/', (req, res) =>
  res.render('index', {
    title: 'CSE Motors — Home',
    description: 'CSE Motors: curated inventory, flexible financing, and certified service.'
  })
);

app.get('/inventory', (req, res) =>
  res.render('inventory', {
    title: 'Inventory - CSE Motors',
    description: 'Browse SUVs, sedans, and trucks. Transparent pricing.'
  })
);

app.get('/finance', (req, res) =>
  res.render('finance', {
    title: 'Finance - CSE Motors',
    description: 'Get pre-approved online in minutes. Competitive rates.'
  })
);

app.get('/service', (req, res) =>
  res.render('service', {
    title: 'Service & Maintenance - CSE Motors',
    description: 'Certified technicians, fair quotes, fast turnaround.'
  })
);

app.get('/privacy', (req, res) =>
  res.render('privacy', { title: 'Privacy - CSE Motors', description: 'Privacy policy.' })
);
app.get('/terms', (req, res) =>
  res.render('terms', { title: 'Terms - CSE Motors', description: 'Terms of service.' })
);
app.get('/contact', (req, res) =>
  res.render('contact', { title: 'Contact - CSE Motors', description: 'Contact us.' })
);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found', description: 'Page not found.' });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));