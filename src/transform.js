/**
 * Transform Starcraft quotes
 */
'use strict';
const fs = require('fs');
const path = require('path');
const uuidv5 = require('uuid/v5');

const pathInput = path.join(__dirname, '../quotes/extract');
const pathOutput = path.join(__dirname, '../quotes/transform');
const pathQuotes = path.join(__dirname, '../quotes/starcraft-1-quotes.json');

/**
 * Ensure strings are clean / neat for .json file
 * @param {string} value - string to make 'clean'
 */
function cleanString(value) {
  return (
    value
      // Remove newlines / carriage returns
      .replace(/\r?\n|\r/g, ' ')
      // Remove quotations
      .replace(/["]+/g, '')
      // Remove ( )
      .replace(/\([^)]*\)/g, '')
      // Remove *
      .replace(/\*[^*]*\*/g, '')
      // Remove < >
      .replace(/\<[^*]*\>/g, '')
      // Remove double spaces
      .replace(/  /g, ' ')
      // Add space after question mark
      .replace(/(\?)([A-Za-z])/g, '$1 $2')
      .trim()
  );
}

/**
 * Ensure unit name is clean / correct
 * @param {string} unit - unit to 'clean'
 */
function cleanQuoteUnit(unit) {
  return cleanString(unit)
    .replace(/\.2F/g, ' ')
    .replace(/\.27/g, "'")
    .replace(/_/g, ' ');
}

/**
 * Ensure action is clean / correct
 * @param {string} action - action to 'clean'
 */
function cleanQuoteAction(action) {
  if (action.includes('Repeatedly selected')) {
    return 'Pissed';
  } else if (action.includes('Other lines')) {
    return 'Other';
  } else if (action.includes('Confirming order')) {
    return 'Confirming';
  }

  return cleanString(action);
}

/**
 * Ensure faction is clean / correct
 * @param {string} faction - faction to 'clean'
 */
function cleanQuoteFaction(faction) {
  return cleanString(faction);
}

/**
 * Ensure the actual quote is clean / correct
 * @param {string} value - the actual quote to 'clean'
 */
function cleanQuoteValue(value) {
  if (value.includes("I don't have time to fk around!")) {
    return "I don't have time to f**k around!";
  } else if (value.includes('Yes, Cerebrate?')) {
    return 'Yes, Cerebrate?';
  }

  return cleanString(value);
}

/**
 * Returns true or false depending on if the 'unit' should be ignored
 * @param {string} value - the value of the quote to inspect
 */
const isIgnoredQuote = value => {
  if (
    value.trim() == 'Attack.' ||
    value.trim() == 'Death.' ||
    value.trim() == 'Hit.' ||
    value.trim().match(/Attack \d./) ||
    value.trim().match(/Hit \d./) ||
    value.trim().match(/Fire \d./) ||
    value.trim().match(/Building \d./) ||
    value.trim().match(/Siege Mode \d./) ||
    value.trim().match(/Death \d./) ||
    value.trim().match(/Yamato Gun \d./) ||
    value.trim().match(/Mine \d./) ||
    value.trim().match(/Repair \d./) ||
    value.trim().match(/Heal \d./) ||
    value.trim().match(/Optic Flare \d./) ||
    value.trim().match(/Restoration \d./) ||
    value.trim().match(/Cloaking Field \d./) ||
    value.trim().match(/Consume \d./) ||
    value.trim().match(/Plague \d./) ||
    value.trim().match(/Ensnare \d./) ||
    value.trim().match(/Parasite \d./) ||
    value.trim().match(/Error \d./) ||
    value.trim().match(/Psionic storm \d./) ||
    value.trim().match(/Hallucination \d./) ||
    value.trim().match(/Recall \d./) ||
    value.trim().match(/Selected \d./) ||
    value.trim().match(/Confirm \d./) ||
    value.trim().match(/Repeatedly selected \d./) ||
    value.trim() == 'Nuclear Strike.' ||
    value.trim() == 'Lockdown.' ||
    value.trim() == 'Afterburners on.' ||
    value.trim() == 'Afterburners off.' ||
    value.trim() == 'Defensive Matrix.' ||
    value.trim() == 'EMP Shockwave.' ||
    value.trim() == 'Irradiate.' ||
    value.trim() == 'Consume.' ||
    value.trim() == 'Error.' ||
    value.trim() == 'Mine.' ||
    value.trim() == 'Archon Warp.' ||
    value.trim() == 'Dark Archon Warp.' ||
    value.trim() == 'Mind Control.' ||
    value.trim() == 'Maelstrom.' ||
    value.trim() == 'Feedback.' ||
    value.trim() == 'Disruption Web.' ||
    value.trim() == 'Interceptor launch.' ||
    value.trim() == 'Stasis Field.' ||
    value.trim() == 'Roar.' ||
    value.trim() == 'Ensnare.' ||
    value.trim() == 'Burrow.' ||
    value.trim() == 'Trained.' ||
    value.trim() == 'Selected.' ||
    value.trim() == 'Repeatedly selected.' ||
    value.trim() == 'Rage.'
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Transforms all quotes including metadata
 * @param {string} input - the name of the JSON file to transform
 * @param {string} output  - the location of the transformed JSON file
 */
function quoteTransformer(input, output) {
  console.log('ALL CREW REPORTING');
  console.log(`TRANSFORMING: ${input}`);

  let cleanQuotes = [];

  let rawData = fs.readFileSync(input);
  let quotes = JSON.parse(rawData);

  quotes.forEach(function(quote) {
    let cleanUnit = cleanQuoteUnit(quote['unit']);
    let cleanValue = cleanQuoteValue(quote['value']);
    let cleanFaction = cleanQuoteFaction(quote['faction']);
    let cleanAction = cleanQuoteAction(quote['action']);

    if (isIgnoredQuote(cleanValue)) {
      return;
    }

    let cleanQuote = {
      value: cleanValue,
      faction: cleanFaction,
      unit: cleanUnit,
      action: cleanAction,
      isHero: quote['isHero'],
      isMelee: quote['isMelee'],
      id: uuidv5(
        `${cleanValue} ${cleanFaction} ${cleanUnit} ${cleanAction}`,
        uuidv5.URL
      )
    };

    if (cleanQuote['value'] !== '') {
      cleanQuotes.push(cleanQuote);
    }
  });

  let data = JSON.stringify(cleanQuotes, null, 2);

  fs.writeFileSync(output, data);
  console.log('MAKE IT HAPPEN');
  console.log(`OUTPUT: ${output}`);

  return cleanQuotes;
}

fs.mkdir(pathOutput, { recursive: true }, err => {
  if (err) throw err;
});

let files = fs.readdirSync(pathInput);
let quotes = [];

files.forEach(function(file) {
  quotes = quotes.concat(
    quoteTransformer(`${pathInput}/${file}`, `${pathOutput}/${file}`)
  );
});

let data = JSON.stringify(quotes, null, 2);

fs.writeFileSync(pathQuotes, data);
console.log('WEAPONS CHARGED AND READY');
console.log(`OUTPUT: ${pathQuotes}`);
