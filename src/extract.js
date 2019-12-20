/**
 * Extract Starcraft quotes from online
 */
'use strict';
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://starcraft.fandom.com/wiki/StarCraft_unit_quotations';

const pathOutput = path.join(__dirname, '../quotes/extract');

const quotesExtractor = async (faction, order) => {
  console.log('SCV GOOD TO GO, SIR');
  console.log(`EXTRACTING INFORMATION FOR: ${faction}`);

  let unit, action;
  let isMelee, isHero;
  let actions = [];
  let quotes = [];
  let quote = {};

  try {
    const response = await axios.get(url);

    let $ = cheerio.load(response.data);
    let currentElement = $(`#${faction}_Quotations`).parent();

    do {
      currentElement = $(currentElement).next();

      if (currentElement.is('h3')) {
        if (
          currentElement
            .children()
            .text()
            .includes('Buildings')
        ) {
          continue;
        }

        let unitType = $(currentElement.children()[0])
          .text()
          .trim();
        if (unitType.includes('Units')) {
          isMelee = true;
          isHero = false;
        } else if (unitType.includes('Heroes')) {
          isMelee = false;
          isHero = true;
        }
      } else if (currentElement.is('h4')) {
        unit = currentElement.children().attr('id');
      } else if (currentElement.is('table')) {
        if (
          currentElement
            .prev()
            .children()
            .text()
            .includes('Buildings') ||
          quotes.some(quote => quote.unit == unit)
        ) {
          continue;
        }

        actions = [];

        currentElement
          .children()
          .children()
          .each((i, row) => {
            if (i % 2 === 0) {
              let columns = $(row).children();

              columns.each((i, column) => {
                actions.push($(column).text());
              });
            } else {
              let columns = $(row).children();

              columns.each((i, column) => {
                action = actions.shift();
                $('li', column).each((i, value) => {
                  quote = {
                    value: $(value).text(),
                    faction: faction.charAt(0).toUpperCase() + faction.slice(1),
                    unit: unit,
                    action: action,
                    isHero: isHero,
                    isMelee: unit === 'Civilian' ? false : isMelee
                  };
                  quotes.push(quote);
                });
              });
            }
          });
      }
    } while ($(currentElement).next()[0] !== undefined);
    {
    }
  } catch (err) {
    console.log(err);
  }

  let data = JSON.stringify(quotes, null, 2);

  fs.mkdir(pathOutput, { recursive: true }, err => {
    if (err) throw err;
  });

  fs.writeFileSync(
    `${pathOutput}/${order}-${faction.toLowerCase()}.json`,
    data
  );

  console.log('JOBS FINISHED');
  console.log(`OUTPUT: ${pathOutput}/${order}-${faction.toLowerCase()}.json`);
};

quotesExtractor('Terran', 1);
quotesExtractor('Zerg', 2);
quotesExtractor('Protoss', 3);
