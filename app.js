const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();

// Bring in routes from routes folder
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const observationRoutes = require('./routes/observations');

// Bring in Body parser middleware
// Allows getting data from request.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Bring in methodOverride to allow for form PUT and DELETE operations
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Load dotenv config
dotenv.config({ path: './config/config.env' });

// Load Passport config
require('./config/passport')(passport);

// Connect to Database
connectDB();

// Bring in morgan in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Use handlebars helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
  capitalize,
} = require('./helpers/hbs');

// Bring in handlebars as view engine
app.engine(
  '.hbs',
  engine({
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select,
      capitalize,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Bring in session middleware (must be above passport middleware)
app.use(
  session({
    secret: 'funny banana',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Bring in passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Bring in static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/observations', observationRoutes);

// Start server
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
