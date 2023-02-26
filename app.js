const express = require('express');
const request = require('request');
const { JSDOM } = require('jsdom');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { h1: null, cssLinks: null });
});

app.post('/scrape', (req, res) => {
    const url = req.body.url;
    request(url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const dom = new JSDOM(html);
        const h1 = dom.window.document.querySelector('h1').outerHTML;
        const styles = getStylesByClassName(dom.window, 'c-page-header__title');
        const stylesheetUrl = 'https://bradfrost.com/wp-content/themes/v8/style.css'; // replace with actual stylesheet URL
        res.render('index', { h1, stylesheetUrl, styles });
      } else {
        res.render('index', { h1: `Error scraping ${url}` });
      }
    });
  });
  
  
  

app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});
