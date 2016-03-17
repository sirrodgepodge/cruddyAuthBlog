const express = require('express'), // used to
      path = require('path'), // handles smooth joining of file paths (inserts slashes where needed, prevents double slashes)
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      favicon = require('serve-favicon'),
      cors = require('cors'),
      dotenv = require('dotenv');


// Grabs key-value pairs from ".env" folder and sets keys as properties on "process.env" object accessable anywhere in the app
dotenv.config();


// Express needs to be instantiated, it's possible to run multiple Express instances in the same node app and have them listen on different ports
const app = express(),
      serverPort = process.env.port || 3000; // If port has been provided by environmental variables use that, else defauly to 3000


// Request parsing middleware
app.use(bodyParser.json()); // allows request body parsing
app.use(bodyParser.urlencoded({ extended: false })); // allows request query string parsing, extended : false means query string values cannot contain JSON (must be simple key-value)
app.use(cookieParser()); // allows cookie parsing (cookies are simple key value stores in the browser)


// Allow CORS (this allows you to serve assets, images for example, from other domains)
app.use(cors());


// used to set favicon (little image next to page title in browser tab)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// Set static folder
app.use(express.static('./public'));


// Log requests to console
if(process.env.NODE_ENV !== 'production')
  app.use(logger('dev'));


// Bring in Auth routes from auth folder
app.use('/auth', require('./auth'));


// Bring in API routes from routes folder
app.use('/api', require('./routes')); //// Note that we do not need to specify "index.js" inside of the "routes" folder, if file is unspecified "index.js" is default when foldr is required


// Serve index.html from root
app.get('/', (req, res, next) => res.sendFile('/index.html', {
  root: './public'
}));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Handle route errors
app.use((err, req, res, next) => {
  console.error(err); // log to back end console
  res.status(err.status || 500);
  res.send(err.message); // send error message text to front end
});


// Launch server on port
app.listen(serverPort, (err, res) => err ?
  handleError(err) :
  console.log(`app served on port ${serverPort}`));

// Note that I can define "handleError" down here and use it above, this is because "declarations" are hoisted in Javascript (can only be done with functions created with this syntax though)
function handleError(err){
  switch (err.code) {
    case 'EACCES':
      console.error(`port ${serverPort} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`port ${serverPort} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}
