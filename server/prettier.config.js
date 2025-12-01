/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  trailingComma: 'es5',
  tabWidth: 2,
  singleQuote: true,
  overrides: [
    {
      files: ['*.html'],
      options: {
        parser: 'angular',
        bracketSameLine: true,
      },
    },
    {
      files: ['*.ts'],
      options: {
        parser: 'typescript',
        insertPragma: true,
        endOfLine: 'lf',
      },
    },
  ],
};
