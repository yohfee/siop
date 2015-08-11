var fetch = require('node-fetch');
var cheerio = require('cheerio');
var _ = require('lodash');

module.exports = function () {
  return fetch('http://www.data.jma.go.jp/svd/eqev/data/kyoshin/jma-shindo.html')
    .then(function (res) {
      return res.text();
    })
    .then(function (html) {
      var $ = cheerio.load(html);
      var $regions = $('h2');
      var regions = {};

      $regions.each(function (regionIndex, region) {
        var $region = $(region);
        var $areas = $region.next('p.mtx').find('a[href^="#"]');
        var areas = {};

        $areas.each(function (areaIndex, area) {
          var $area = $(area);
          var $data = $('a[name="' + $area.attr('href').slice(1) + '"]').next('table.data.mtx');
          var $columns = $data.find('tr:first-child th');
          var $points = $data.find('tr:not(:first-child)');
          var points = [];

          $points.each(function (pointIndex, point) {
            var $point = $(point);
            var $values = $point.find('td');
            var values = {};

            $columns.each(function (columnIndex, column) {
              var $column = $(column);
              var $value = $($values[columnIndex]);
              var value = $value.text();

              if (!isNaN(value)) {
                value = Number(value);
              }

              values[$column.text()] = value;
            });

            points.push(values);
          });

          areas[$area.text()] = _.groupBy(points, $columns.first().text());
        });

        regions[$region.text()] = areas;
      });

      return regions;
    });
};
