module.exports = {
  extends: ['stylelint-config-prettier', 'stylelint-config-recess-order', 'stylelint-config-recommended'],
  ignoreFiles: ['**/node_modules/**'],
  customSyntax: '@stylelint/postcss-css-in-js',
  rules: {
    'property-no-vendor-prefix': null,
  },
};
