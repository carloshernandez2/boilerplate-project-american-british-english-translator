const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const _ = require("underscore");

class Translator {
  translatable(text, only, spelling, titles, timeSplit) {
    const words = [];
    const regexCreator = (word) => {
      return new RegExp(`\\s${word}[\\s.?!]`, "i");
    };
    for (const word in only) {
      const regex = regexCreator(word);
      if (regex.test(text))
        words.push({
          prev: word,
          after: ` <span class="highlight">${only[word]}</span> `,
        });
    }
    for (const word in spelling) {
      const regex = regexCreator(word);
      if (regex.test(text))
        words.push({
          prev: word,
          after: ` <span class="highlight">${spelling[word]}</span> `,
        });
    }
    for (const word in titles) {
      const regex = regexCreator(word);
      if (regex.test(text))
        words.push({
          prev: word,
          after: ` <span class="highlight">${titles[word]}</span> `,
        });
    }
    const regex = new RegExp(`\\s(\\d\\d?[.:]\\d{2})[\\s.?!]`, "gi");
    const timesArray = text.match(regex) ? [...text.matchAll(regex)] : [];
    return words.concat(
      timesArray.map((time) => ({
        prev: time[1],
        after: ` <span class="highlight">${time[1]
          .replace(timeSplit, timeSplit === ":" ? "." : ":")
          }</span> `,
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
    if (!locale) {
      return { error: 'Required field(s) missing' }
    } else if (text === '') {
      return { error: 'No text to translate' }
    } else if (!text) {
      return { error: 'Required field(s) missing' }
    } else if (!/^american-to-british$|^british-to-american$/.test(locale)) {
      return { error: 'Invalid value for locale field' }
    }else {
      const spacedText = " " + text.trim() + " ";
    const wordsToTranslate =
      locale === "american-to-british"
        ? this.translatableAmerican(spacedText)
        : this.translatableBrit(spacedText);
    const translation = wordsToTranslate
      .reduce((acc, translation) => {
        const regex = new RegExp(`\\s${translation.prev}([\\s.?!])`, "gi");
        return acc.replace(regex, (a, b) => {
          const after =
            translation.after.slice(0, translation.after.length - 1) + b;
          return after;
        });
      }, spacedText)
      .trim();
    return translation === text ? "Everything looks good to me!" : translation;
    }
  }
}

module.exports = Translator;
