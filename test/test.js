var test = require('tape');
var nock = require('nock');

var siop = require('../lib/siop');

var scope = nock('http://www.data.jma.go.jp')
  .get('/svd/eqev/data/kyoshin/jma-shindo.html')
  .replyWithFile(200, __dirname + '/fixture.html');

test('generating seismic intensity observation point data', function (t) {
  siop()
    .then(function (data) {
      var region = data.regions[1];
      var prefecture = region.prefectures[2];
      var area = prefecture.areas[2];
      var point = area.points[1];

      t.equal(region.name, '東北地方');
      t.equal(prefecture.name, '宮城県');
      t.equal(area.name, '宮城県中部');
      t.equal(point.name, '仙台宮城野区五輪');
      t.equal(point.address, '仙台市宮城野区五輪1-3-15（仙台管区気象台）');
      t.equal(point.latitude, 38.26166666666666);
      t.equal(point.longitude, 140.89666666666668);

      t.end();
    })
    .catch(function (error) {
      t.end(error);
    });
});
