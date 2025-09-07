const express = require('express');
const path = require('path');
const layouts = require('express-ejs-layouts');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);
app.set('layout', 'layouts/main');

// make year available to all views
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

// index route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home - CSE Motors' });
});

// health check for Render
app.get('/health', (_req, res) => res.status(200).send('ok'));

// 404
app.use((req, res) => res.status(404).render('404', { title: 'Not Found - CSE Motors' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
