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
      var regions = [];

      $regions.each(function (regionIndex, region) {
        var $region = $(region);
        var $prefectures = $region.next('p.mtx').find('a[href^="#"]');
        var prefectures = [];

        $prefectures.each(function (prefectureIndex, prefecture) {
          var $prefecture = $(prefecture);
          var $data = $('a[name="' + $prefecture.attr('href').slice(1) + '"]').next('table.data.mtx');
          var $points = $data.find('tr:not(:first-child)');
          var points = [];

          $points.each(function (pointIndex, point) {
            var $point = $(point);
            var $values = $point.find('td');
            var point = {
              area: $($values[0]).text(),
              name: $($values[1]).text(),
              address: $($values[2]).text(),
              latitude: Number($($values[3]).text()) + Number($($values[4]).text()) / 60,
              longitude: Number($($values[5]).text()) + Number($($values[6]).text()) / 60,
            };

            points.push(point);
          });

          var areas = _.chain(points)
            .groupBy('area')
            .map(function (points, area) {
              return {
                name: area,
                points: _.map(points, function (point) {
                  return _.omit(point, 'area');
                })
              };
            })
            .value();

          prefectures.push({ name: $prefecture.text(), areas: areas });
        });

        regions.push({ name: $region.text(), prefectures: prefectures });
      });

      return { regions: regions };
    });
};
