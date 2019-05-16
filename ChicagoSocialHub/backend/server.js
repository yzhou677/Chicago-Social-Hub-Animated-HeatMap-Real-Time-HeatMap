////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/27/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//////////////////////              SETUP NEEDED                ////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

//  Install Nodejs (the bundle includes the npm) from the following website:
//      https://nodejs.org/en/download/


//  Before you start nodejs make sure you install from the  
//  command line window/terminal the following packages:
//      1. npm install express
//      2. npm install pg
//      3. npm install pg-format
//      4. npm install moment --save
//      5. npm install elasticsearch


//  Read the docs for the following packages:
//      1. https://node-postgres.com/
//      2.  result API: 
//              https://node-postgres.com/api/result
//      3. Nearest Neighbor Search
//              https://postgis.net/workshops/postgis-intro/knn.html    
//      4. https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html
//      5. https://momentjs.com/
//      6. http://momentjs.com/docs/#/displaying/format/


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


const express = require('express');

var pg = require('pg');

var bodyParser = require('body-parser');

const moment = require('moment');


// Connect to elasticsearch Server

const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});


// Connect to PostgreSQL server

var conString = "pg://postgres:root@127.0.0.1:5432/chicago_divvy_stations";
var pgClient = new pg.Client(conString);
pgClient.connect();

var find_places_task_completed = false;


const app = express();
const router = express.Router();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



var places_found = [];
var stations_found = [];
var place_selected;
var all_stations_nearby = [];
var stations_nearby_twenty_four_hours = [];
var organized_stations_nearby_twenty_four_hours = [];
var log_stations_found = [];


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//////   The following are the routes received from NG/Browser client        ////////

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



router.route('/places').get((req, res) => {

    res.json(places_found);

});



router.route('/place_selected').get((req, res) => {

    res.json(place_selected);

});



router.route('/allPlaces').get((req, res) => {

    res.json(places_found);

});




router.route('/stations').get((req, res) => {

    res.json(stations_found);

});

router.route('/find_all_stations_nearby').get((req, res) => {

    all_stations_nearby = removeDuplicate(all_stations_nearby);
    res.json(all_stations_nearby);

});

router.route('/stations_nearby_twenty_four_hours').get((req, res) => {

    organize_data();
    res.json(organized_stations_nearby_twenty_four_hours);

});

function removeDuplicate(data) {
    var noDuplicateStations = [];
    data.forEach((station) => {
        if (!noDuplicateStations.some(stationInfo => stationInfo.id === station.id)) {
            noDuplicateStations.push(station);
        }
    });
    return noDuplicateStations;
}


function minLength() {
    min_length = 10000;
    stations_nearby_twenty_four_hours.forEach((element) => {
        if (element.length < min_length) {
            min_length = element.length;
        }
    });

    return min_length;
}

function organize_data() {
    organized_stations_nearby_twenty_four_hours = [];
    var min = minLength();
    var station_data = [];
    for (let i = 0; i < min; i++) {
        station_data = [];
        for (let j = 0; j < stations_nearby_twenty_four_hours.length; j++) {
            station_data.push(stations_nearby_twenty_four_hours[j][i])
        }
        organized_stations_nearby_twenty_four_hours.push(station_data);
    }

}

router.route('/stations/find_all_stations_nearby_twenty_four_hours').post((req, res) => {
    var str = JSON.stringify(req.body, null, 4);

    stations_nearby_twenty_four_hours = [];
    var stationsIdList = req.body.stationsIdList;
    var count = 0, length = stationsIdList.length;
    for (let i = 0; i < length; i++) {
        const query_divvy = {
            // give the query a unique name
            name: 'fetch-divvy-by-id',
            text: 'SELECT * FROM divvy_stations_logs WHERE id = $1 AND lastcommunicationtime >= (NOW() - INTERVAL \'24 hours\' ) order by lastcommunicationtime',
            values: [stationsIdList[i]]
        }
        find_stations_from_divvy_stations_logs(query_divvy).then(function (response) {
            stations_nearby_twenty_four_hours.push(log_stations_found);
            ++count;
            if (count == length) {
                // Code executed only after all the processing tasks have been completed
                res.json(stations_nearby_twenty_four_hours)
            }
        });
    }
});

router.route('/stations/find_all_stations_nearby').post((req, res) => {
    all_stations_nearby = [];
    var count = 0, length = places_found.length;
    for (let i = 0; i < length; i++) {
        const query_divvy = {
            // give the query a unique name
            name: 'fetch-divvy-nearby',
            text: ' SELECT * FROM divvy_stations_status ORDER BY (divvy_stations_status.where_is <-> ST_POINT($1,$2)) ASC',
            values: [places_found[i].latitude, places_found[i].longitude]
        }
        find_all_stations_nearby(query_divvy, places_found[i].latitude, places_found[i].longitude).then(function (response) {
            var hits = response;
            ++count;
            if (count == length) {
                // Code executed only after all the processing tasks have been completed
                res.json(all_stations_nearby)
            }

        });
    }
});

router.route('/places/find').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);

    find_places_task_completed = false;

    find_places_from_yelp(req.body.find, req.body.where, req.body.zipcode).then(function (response) {
        var hits = response;
        res.json(places_found);
    });

});





router.route('/stations/find').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);

    for (var i = 0, len = places_found.length; i < len; i++) {

        if (places_found[i].name === req.body.placeName) { // strict equality test

            place_selected = places_found[i];

            break;
        }
    }

    const query = {
        // give the query a unique name
        name: 'fetch-divvy',
        text: ' SELECT * FROM divvy_stations_status ORDER BY (divvy_stations_status.where_is <-> ST_POINT($1,$2)) ASC LIMIT 3',
        values: [place_selected.latitude, place_selected.longitude]
    }

    find_stations_from_divvy(query).then(function (response) {
        var hits = response;
        res.json({ 'stations_found': 'Added successfully' });
    });


});




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Divvy - PostgreSQL - Client API            /////////////////

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
async function find_stations_from_divvy(query) {

    const response = await pgClient.query(query);

    stations_found = [];

    for (i = 0; i < 3; i++) {

        plainTextDateTime = moment(response.rows[i].lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');


        var station = {
            "id": response.rows[i].id,
            "stationName": response.rows[i].stationname,
            "availableBikes": response.rows[i].availablebikes,
            "availableDocks": response.rows[i].availabledocks,
            "is_renting": response.rows[i].is_renting,
            "lastCommunicationTime": plainTextDateTime,
            "latitude": response.rows[i].latitude,
            "longitude": response.rows[i].longitude,
            "status": response.rows[i].status,
            "totalDocks": response.rows[i].totaldocks
        };

        stations_found.push(station);

    }


}

async function find_all_stations_nearby(query, latitude, longitude) {

    let response = await pgClient.query(query);
    if ((response.rows[0] == 665 && response.rows[1] == 2 && response.rows[2] == 3)||
    (response.rows[2] == 665 && response.rows[0] == 2 && response.rows[1] == 3) || 
    (response.rows[2] == 665 && response.rows[1] == 2 && response.rows[0] == 3) ||
    (response.rows[0] == 2 && response.rows[1] == 3 && response.rows[2] == 4)) {
        response = await pgClient.query({
            // give the query a unique name
            name: 'fetch-divvy-nearby',
            text: ' SELECT * FROM divvy_stations_status ORDER BY (divvy_stations_status.where_is <-> ST_POINT($1,$2)) ASC LIMIT 3',
            values: [latitude, longitude]
        })
    }

    for (i = 0; i < 3; i++) {

        plainTextDateTime = moment(response.rows[i].lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');


        var station = {
            "id": response.rows[i].id,
            "availableDocks": response.rows[i].availabledocks,
            "lastCommunicationTime": plainTextDateTime,
            "latitude": response.rows[i].latitude,
            "longitude": response.rows[i].longitude
        };


        all_stations_nearby.push(station);
    }

}



async function find_stations_from_divvy_stations_logs(query) {
    const response = await pgClient.query(query);

    log_stations_found = [];

    for (i = 0; i < response.rows.length; i++) {
        plainTextDateTime = moment(response.rows[i].lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');


        var station = {
            "id": response.rows[i].id,
            "stationName": response.rows[i].stationname,
            "availableDocks": response.rows[i].availabledocks,
            "lastCommunicationTime": plainTextDateTime,
            "latitude": response.rows[i].latitude,
            "longitude": response.rows[i].longitude
        };

        log_stations_found.unshift(station)

    }

}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Yelp - ElasticSerch - Client API            /////////////////

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



async function find_places_from_yelp(place, where, zipcode) {

    places_found = [];

    //////////////////////////////////////////////////////////////////////////////////////
    // Using the business name to search for businesses will leead to incomplete results
    // better to search using categorisa/alias and title associated with the business name
    // For example one of the famous places in chicago for HotDogs is Portillos
    // However, it also offers Salad and burgers
    // Here is an example of a busness review from Yelp for Pertilos
    //               alias': 'portillos-hot-dogs-chicago-4',
    //              'categories': [{'alias': 'hotdog', 'title': 'Hot Dogs'},
    //                             {'alias': 'salad', 'title': 'Salad'},
    //                             {'alias': 'burgers', 'title': 'Burgers'}],
    //              'name': "Portillo's Hot Dogs",
    //////////////////////////////////////////////////////////////////////////////////////
    let body;
    if ((zipcode != "" && where != "") || (zipcode == "" && where == "")) {
        body = {
            size: 1000,
            from: 0,
            "query": {
                "bool": {
                    "must": {
                        "term": { "categories.alias": place }
                    },

                    "filter": [
                        { "term": { "location.zip_code": zipcode } },
                        { "term": { "location.address1": where } }
                    ],
                    "must_not": {
                        "range": {
                            "rating": { "lte": 3 }
                        }
                    },

                    "must_not": {
                        "range": {
                            "review_count": { "lte": 500 }
                        }
                    },

                    "should": [
                        { "term": { "is_closed": "false" } }
                    ],
                }
            }
        }
    } else if (zipcode != "" && where == "") {
        body = {
            size: 1000,
            from: 0,
            "query": {
                "bool": {
                    "must": {
                        "term": { "categories.alias": place }
                    },

                    "filter": {
                        "term": { "location.zip_code": zipcode }
                    },

                    "must_not": {
                        "range": {
                            "rating": { "lte": 3 }
                        }
                    },

                    "must_not": {
                        "range": {
                            "review_count": { "lte": 500 }
                        }
                    },

                    "should": [
                        { "term": { "is_closed": "false" } }
                    ],
                }
            }
        }
    } else if (zipcode == "" && where != "") {
        body = {
            size: 1000,
            from: 0,
            "query": {
                "bool": {
                    "must": {
                        "term": { "categories.alias": place }
                    },

                    "filter": {
                        "term": { "location.address1": where }
                    },

                    "must_not": {
                        "range": {
                            "rating": { "lte": 3 }
                        }
                    },

                    "must_not": {
                        "range": {
                            "review_count": { "lte": 500 }
                        }
                    },

                    "should": [
                        { "term": { "is_closed": "false" } }
                    ],
                }
            }
        }
    }

    results = await esClient.search({ index: 'chicago_yelp_reviews', body: body });

    results.hits.hits.forEach((hit, index) => {


        var place = {
            "name": hit._source.name,
            "display_phone": hit._source.display_phone,
            "address1": hit._source.location.address1,
            "is_closed": hit._source.is_closed,
            "rating": hit._source.rating,
            "review_count": hit._source.review_count,
            "latitude": hit._source.coordinates.latitude,
            "longitude": hit._source.coordinates.longitude,
            "zip_code": hit._source.location.zip_code
        };

        places_found.push(place);

    });

    find_places_task_completed = true;

}



app.use('/', router);

var server = app.listen(4000, () => console.log('Express server running on port 4000'));
var io = require('socket.io').listen(server);

pgClient.query('LISTEN events')

pgClient.on('notification', (msg) => {
    var obj = JSON.parse(msg.payload);  // msg.payload string 
    plainTextDateTime = moment(obj.data.lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');
    var station = {
        "id": obj.data.id,
        "availableDocks": obj.data.availabledocks,
        "lastCommunicationTime": plainTextDateTime,
        "latitude": obj.data.latitude,
        "longitude": obj.data.longitude,
    };

    io.sockets.emit(obj.data.id, station);
})

io.on('connection', function (socket) {
    console.log('a user connected');
});