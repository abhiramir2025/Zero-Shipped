// Generic text helpers shared across services.

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Case-insensitive word-boundary match: "java" must not hit "JavaScript",
// "js" must not hit "JSON". The dot in the lookbehind keeps "Next.js" from
// counting as the "js" (JavaScript) alias.
function matches(text, variant) {
  const re = new RegExp("(?<![\\w.])" + escapeRegExp(variant) + "(?![\\w])", "i");
  return re.test(text);
}

module.exports = { escapeRegExp, matches };
