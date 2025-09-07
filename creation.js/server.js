const express = require('express');
const path = require('path');
const layouts = require('express-ejs-layouts');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);
app.set('layout', 'layouts/main');

// make year available in footer
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

// ROUTES
// 👇 Pick which file is your homepage
app.get('/', (req, res) => {
  // use 'creation' if you want creation.ejs as home
  res.render('index', { title: 'Home - CSE Motors' });
});

// optional extra route for /creation
app.get('/creation', (req, res) => {
  res.render('creation', { title: 'Creation Page' });
});

// serve favicon to avoid 404
app.get('/favicon.ico', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public/images/favicon.ico'))
);

// Render health check
app.get('/health', (_req, res) => res.send('ok'));

// fallback — redirect unknown routes to home
app.use((req, res) => res.redirect('/'));

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running: http://localhost:${PORT}`));
