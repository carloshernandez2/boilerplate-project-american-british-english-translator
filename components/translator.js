const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const _ = require("underscore");

class Translator {
  translatable(text, only, spelling, titles, timeSplit) {
    const words = [];
    for (const word in only) {
      const regex = new RegExp(`\\s${word}\\s`);
      if (regex.test(text))
        words.push({
          prev: word,
          after: ` <span class="highlight">${only[word]}<span> `,
        });
    }
    for (const word in spelling) {
      const regex = new RegExp(`\\s${word}\\s`);
      if (regex.test(text))
        words.push({
          prev: word,
          after: ` <span class="highlight">${spelling[word]}<span> `,
        });
    }
    for (const word in titles) {
      const regex = new RegExp(`\\s${word}\\s`);
      if (regex.test(text))
        words.push({
          prev: word,
          after: ` <span class="highlight">${titles[word]}<span> `,
        });
    }
    const regex = new RegExp(`\\s\\d{2}[${timeSplit}]\\d{2}\\s`, "g");
    const timesArray = text.match(regex) ? text.match(regex) : [];
    return words.concat(
      timesArray.map((time) => ({
        prev: time.trim(),
        after: ` <span class="highlight">${time
          .replace(timeSplit, timeSplit === ":" ? "." : ":")
          .trim()}<span> `,
      }))
    );
  }

  translatableAmerican(text) {
    return this.translatable(
      text,
      americanOnly,
      americanToBritishSpelling,
      americanToBritishTitles,
      ":"
    );
  }

  translatableBrit(text) {
    const britishToAmericanSpelling = _.invert(americanToBritishSpelling);
    const britishToAmericanTitles = _.invert(americanToBritishTitles);
    return this.translatable(
      text,
      britishOnly,
      britishToAmericanSpelling,
      britishToAmericanTitles,
      "."
    );
  }

  translate(text, locale) {
    const spacedText = " " + text.trim() + " ";
    const wordsToTranslate =
      locale === "american-to-british"
        ? this.translatableAmerican(spacedText)
        : this.translatableBrit(spacedText);
    return (
      wordsToTranslate
        .reduce((acc, translation) => {
          const regex = new RegExp(`\\s${translation.prev}\\s`);
          return acc.replace(regex, translation.after);
        }, spacedText)
        .trim()
    );
  }
}

module.exports = Translator;
