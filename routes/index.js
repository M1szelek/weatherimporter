var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
const Snapshot = require('../models').Snapshot;

/* GET home page. */
router.get('/', function(req, res, next) {
    Snapshot.findOne({
        attributes: ['time'],
        order: [['time', 'DESC']]
    }).then((res) => {
        let fromTime = res.time;
        MongoClient.connect(process.env.MONGODB_URI)
            .then(function (client) { // <- db as first argument
                let db = client.db();
                const collection = db.collection('weather');
                collection.find({'currently.time': {$gt: fromTime}}, {
                    projection: {
                        'currently': 1,
                        '_id': 0
                    }
                }).toArray(function (err, docs) {
                    let snapshots = docs.map((doc) => {
                        return doc.currently;
                    });

                    Snapshot
                        .bulkCreate(snapshots)
                        .then(() => {
                            console.log("Weather saved.")
                        })
                        .catch(() => {
                            console.log("Something went wrong. Weather not saved.")
                        });
                });

            })
            .catch(function (err) {
                console.log(err);
            });
    }).catch((e) => {
        console.log('Error during fetching fromTime');
        console.log(e);
    });
});

module.exports = router;
