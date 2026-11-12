const fs = require('fs');
const path = require('path');

function getFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(getFiles(file, ext));
    else if (file.endsWith(ext)) results.push(file);
  });
  return results;
}

function checkProject(name, dir) {
  console.log('=== CHECKING ' + name + ' ===');
  const jsxFiles = getFiles(dir, '.jsx');
  const cssFiles = getFiles(dir, '.css');

  let allCssText = '';
  cssFiles.forEach(f => { allCssText += '\n' + fs.readFileSync(f, 'utf8'); });

  const missing = {};

  jsxFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /className=["'`]([^"'`]+)["'`]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const classes = match[1].split(/\s+/).filter(Boolean);
      classes.forEach(c => {
        if (c.includes('{') || c.includes('$') || c.length < 3) return;
        // check if class exists in css
        const escaped = c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const classRegex = new RegExp('\\.' + escaped + '(?=[\\s{,.:#\\[>]|$)');
        if (!classRegex.test(allCssText)) {
          if (!missing[c]) missing[c] = [];
          if (!missing[c].includes(path.basename(f))) {
            missing[c].push(path.basename(f));
          }
        }
      });
    }
  });

  Object.keys(missing).forEach(cls => {
    console.log('Missing in CSS:', cls, 'used in:', missing[cls].join(', '));
  });
}

checkProject('CAMPS', './sevana-camps/Sevana-Camps-Module/src');
checkProject('DONATIONS', './sevana-donations/Sevana-Donations-And-Aid/src');

