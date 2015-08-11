# siop

Japan Meteorological Agency seismic intensity observation point JSON generator

## Installation

as cli command

```shell
npm install -g siop
```

as npm module

```shell
npm install --save siop
```

## Usage

as cli command

```shell
siop > data.json
```

as npm module

```js
var siop = require('siop');

siop()
  .then(function (data) {
    console.log(JSON.stringify(data));
  })
  .catch(function (error) {
    console.error(error);
  });
```
