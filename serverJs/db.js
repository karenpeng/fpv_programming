var mongoose = require('mongoose');
var config = require('./config.json');

/**
 * define model structure in db
 * @type {Schema}
 */
var recordSchema = mongoose.Schema({
  'name': {
    type: String
  },
  'timing': {
    type: String
  },
  'times': {
    type: String
  }
});

/**
 * set up index
 * @type {Number}
 */
recodeSchema.index({
  master_id: 1,
  timing: -1,
  times: -1
});
var Record = mongoose.model('Record', recordSchema);

/*
set up db connection
 */
mongoose.connect(config.dbName.key);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // yay!
  console.log('yay!');
});

/**
 * query records
 * @param  {[type]} rep [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function getRecords(req, res) {
  //get the data from db
  var query = {};
  var selet = 'name timing times';
  var option = {
    limit: 5,
    sort: {
      "timing": -1
    }
  };
  Record.find(query, selet, option, function (err, data) {
    if (err) {
      return console.error(err);
    }
    res.send(data);
  });
}

function saveRecord(req, res) {
  var query = req.query;
  if (!query.name) {
    return res.send('need name');
  }
  if (!query.timing) {
    return res.send('need timing');
  }
  if (!query.times) {
    return res.send('need times');
  }
  var record = new Record();
  record.name = query.name;
  record.timing = query.timing;
  record.timing = query.times;
  record.save(function (err) {
    if (err) return console.error(err);
  });
};