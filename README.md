# Starcraft Quotes

## Summary

Wrapper returning Starcraft quotes with metadata.

Also contains quick scripts to extract and transform Starcraft quotes.
Grabs every unique quote found.
Includes selectable melee unit quotes and selectable campaign unit quotes.

Quotes involving gibberish are not included.

Does not include cinematic or cutscene quotes.

Thanks to https://starcraft.fandom.com for housing the quotes.

## Installation

`npm i @blizzard-quotes/starcraft-1-quotes`

## Example

```
const starcraft1Quotes = require('@blizzard-quotes/starcraft-1-quotes');

console.log(starcraft1Quotes);
```

## Execution

### Extract quotes and generate JSON files for each faction

`npm run extract`

Extracted quotes can be found under ./quotes/extract

### Transform quotes and generate JSON files for each faction along with one JSON file to rule them all.

`npm run transform`

Transformed quotes for each faction can be found under ./quotes/transform.

./quotes/starcraft-1-quotes.json contains all quotes.
