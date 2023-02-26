const express = require('express');
const request = require('request');
const { JSDOM } = require('jsdom');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { h1: null, cssLinks: null });
});

app.post('/scrape', (req, res) => {
  const url = decodeURIComponent(req.body.url);
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const dom = new JSDOM(html);
      const h1 = dom.window.document.querySelector('h1').outerHTML;
      const cssLinks = Array.from(dom.window.document.querySelectorAll('head link[rel="stylesheet"]')).map(link => link.outerHTML);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ h1, cssLinks }));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ h1: `Error scraping ${url}` }));
    }
  });
});

app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});
