// app.js
const express = require('express');
const request = require('request');
const { JSDOM } = require('jsdom');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { h1: null, h2s: null, cssLinks: null });
});

app.post('/scrape', (req, res) => {
  const url = req.body.url;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const dom = new JSDOM(html);
      const h1 = dom.window.document.querySelector('h1').outerHTML;
      const h2s = Array.from(dom.window.document.querySelectorAll('h2')).map(h2 => {
        const style = dom.window.getComputedStyle(h2);
        return { html: h2.outerHTML, style: style.cssText };
      });
      const cssLinks = Array.from(dom.window.document.querySelectorAll('head link[rel="stylesheet"]')).map(link => ({
        href: link.getAttribute('href'),
        rel: link.getAttribute('rel')
      }));
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ h1, h2s, cssLinks }));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ h1: `Error scraping ${url}` }));
    }
  });
});

app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});
