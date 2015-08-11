var test = require('tape');
var nock = require('nock');

var siop = require('../lib');

var scope = nock('http://www.data.jma.go.jp')
  .get('/svd/eqev/data/kyoshin/jma-shindo.html')
  .replyWithFile(200, __dirname + '/fixture.html');

test('generating seismic intensity observation point data', function (t) {
  siop()
    .then(function (regions) {
      t.equal(regions['東北地方']['宮城県']['宮城県中部'][1]['震度観測点名称'], '仙台宮城野区五輪');

      t.end();
    })
    .catch(function (error) {
      t.end(error);
    });
});
