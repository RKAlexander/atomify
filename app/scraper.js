const cheerio = require('cheerio');
const axios = require('axios');

async function scrapeWebpage(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const patternLabData = {
    atoms: []
  };

  // Extract the atomic elements
  $('*').each(function() {
    const id = $(this).attr('id');
    const classes = $(this).attr('class');
    const tag = $(this).prop('tagName').toLowerCase();
    const text = $(this).text().trim();

    if (id || classes) {
      const atomicElement = {
        attributes: {
          id: id || null,
          class: classes || null,
        },
        markup: $(this).html(),
        name: tag,
        patternSpecific: {
          text: text,
        }
      };
      patternLabData.atoms.push(atomicElement);
    }
  });

  return patternLabData;
}

module.exports = scrapeWebpage;
