const express = require('express');
const scrapeWebpage = require('./scraper');
const bodyParser = require('body-parser');
const app = express();

// Serve static files in the public directory
app.use(express.static('public'));

// Configure body-parser middleware
app.use(bodyParser.json());

// Route for serving the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route for handling form submissions 
app.post('/scrape', async (req, res) => {
  console.log('req.body:',JSON.stringify(req.body));
  const url = req.body.url;
  console.log('Scraping URL:', url);
  const atomicElements = await scrapeWebpage(url);
  res.json(atomicElements);
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});