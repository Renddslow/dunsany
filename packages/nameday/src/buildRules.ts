import fs from 'fs';
import { promisify } from 'util';
import globby from 'globby';
import titleize from 'titleize';
import makeDir from 'make-dir';
import path from 'path';
import prettier from 'prettier';
import pupa from 'pupa';

import parseDataset from './utils/parseDataset';
import datasetToSiblingTree from './utils/datasetToSiblingTree';
import getMinMax from './utils/getMinMax';

const prettify = (src) =>
  prettier.format(src, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'es5',
  });

const readCSV = async (filenname) =>
  (await promisify(fs.readFile)(filenname)).toString().split('\n');
const write = promisify(fs.writeFile);

const buildRules = async () => {
  const locales = {};

  const filenames = await globby('data/*.csv');
  const regexpr = /data\/(.*?)\.csv/g;

  // Get all datasets and create naming rules for them. We do this
  // separate from writing to file to ensure that a locale with multiple datasets
  // gets exported to one file at the end.
  await Promise.all(
    filenames.map(async (f) => {
      const [, dataName] = new RegExp(regexpr).exec(f);
      const [locale, type] = dataName.split('.');
      const localeTitle = titleize(locale);

      if (!locales[localeTitle]) locales[localeTitle] = {};

      const names = await readCSV(f);
      const siblings = datasetToSiblingTree(<Record<string, Array<string>>>parseDataset(names));
      const minMax = getMinMax(names);

      locales[localeTitle][type] = {
        ...minMax,
        siblings,
      };
    }),
  );

  const localeKeys = Object.keys(locales);
  const indexImports = localeKeys
    .map((locale) => `const ${locale} = require('./${locale}');`)
    .join('\n');
  const index = `${indexImports}\n\nmodule.exports = {\n${localeKeys.join(',\n')}\n};`;

  const dataDir = path.join(process.cwd(), 'dist/data');
  await makeDir(dataDir);
  await write(path.join(dataDir, 'index.js'), prettify(index));

  const template = 'module.exports = {obj}';

  await Promise.all(
    localeKeys.map((locale) =>
      write(
        path.join(dataDir, `${locale}.js`),
        prettify(
          pupa(template, {
            obj: JSON.stringify(locales[locale], null, 2),
          }),
        ),
      ),
    ),
  );
};

buildRules();
