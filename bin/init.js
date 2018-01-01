const fs = require('fs');
const path = require('path');

// #1
// заполнение БД значениями по умолчанию
// ...

// #2
// копирование конфига при установке
if (!fs.existsSync(path.join(__dirname, '..', 'etc', 'config.json'))) {
  fs.copyFileSync(
    path.join(__dirname, '..', 'etc', 'config.default.json'),
    path.join(__dirname, '..', 'etc', 'config.json')
  );
}
