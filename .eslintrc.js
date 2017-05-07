module.exports = {
  "parser": 'babel-eslint',
  "env": {
    "browser": true,
    "es6": true,
    "commonjs": true,
    "node": true
  },
  "globals": {
    "chrome": true,
    "moment": true,
    "Sortable": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "indent": ["error", 4],
    "linebreak-style": ["error","unix"],
    "quotes": ["error","single"],
    "semi": ["error","always"],
    "no-console": ["warn", { "allow": ["info", "error"] }]
  }
};
