#!/usr/bin/env node

require('../index')()
  .then(function (regions) {
    process.stdout.write(JSON.stringify(regions));
    exit(0);
  })
  .catch(function (error) {
    process.stderr.write(error);
    exit(1);
  });
