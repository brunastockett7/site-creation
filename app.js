/* eslint-env node */
/* eslint-disable no-console */

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const invRouter = require('./routes/inventoryroute'); // <-- your router
const invModel = require('./models/inventory-model');  // <-- for nav data

const app = express();
const PORT = process.env.PORT || 3000;

/* -------- Core middleware -------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // parse form posts
app.use(express.json());

/* -------- Sessions + flash -------- */
app.use(
  session({
    secret: 'super-secret', // ok for class projects
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' }
  })
);

// expose one-time flash to all views
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

/* -------- View engine + layouts -------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

/* -------- Global nav (classifications) -------- */
app.use(async (_req, res, next) => {
  try {
    const rows = await invModel.getClassifications();
    res.locals.nav = rows; // always an array
    console.log('Nav classifications count:', rows.length);
  } catch (e) {
    console.error('Nav load failed:', e.message);
    res.locals.nav = [];
  }
  next();
});

/* -------- Public pages -------- */
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
  res.render('finance', { title: 'Finance - CSE Motors', description: 'Get pre-approved online.' })
);

app.get('/service', (req, res) =>
  res.render('service', { title: 'Service & Maintenance - CSE Motors', description: 'Certified techs.' })
);

app.get('/privacy', (req, res) => res.render('privacy', { title: 'Privacy - CSE Motors' }));
app.get('/terms', (req, res) => res.render('terms', { title: 'Terms - CSE Motors' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact - CSE Motors' }));

/* -------- MVC routes (W04) -------- */
app.use('/inv', invRouter); // /inv/management, /inv/add-classification, /inv/add-vehicle, etc.

/* -------- 404 + 500 -------- */
app.use((req, res) => res.status(404).render('404', { title: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error' });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
