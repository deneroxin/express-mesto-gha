const validationPatterns = {
  patternURL: /^https?:\/\/(?:www\.)?(?:[a-z\d-]+\.)+[a-z]+\/[-\w.~:/?#[\]@!$&'()*+,;=]+#?$/,
  // 1) protocol  1            2           3           4              5                 6
  // 2) optional www.
  // 3) domain and subdomains (one or more words ended with .)
  // 4) domain zone (assume there can be only letters, though I'm not sure)
  // 5) path (\w incorporates digits and the underscore) - can't be empty
  // 6) optional # at the end
};

module.exports = {
  validationPatterns,
  validators: {
    isURL: (string) => validationPatterns.patternURL.test(string),
  },
};
