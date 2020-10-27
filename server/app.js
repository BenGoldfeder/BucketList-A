const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

const session = require('express-session');

const RedisStore = require('connect-redis')(session); //Added in ver. C
const url = require('url');
const redis = require('redis');

const csrf = require('csurf');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(dbURL, mongooseOptions,(err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
});


//Redis for ver. C
let redisURL = {
    hostname: 'redis-13139.c240.us-east-1-3.ec2.cloud.redislabs.com',
    port: '13139',
};
let redisPASS = 'APOOpVCP0lXB87BcuW6O4EtHbLak22Cs';
if (process.env.REDISCLOUD_URL) {
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    [, redisPass] = redisURL.auth.split(':');
}
let redisClient = redis.createClient({
    host: redisURL.hostname,
    port: redisURL.port,
    password: redisPASS,
});




const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(session({
    key: 'sessionid', //renamed for security
    store: new RedisStore({ //Redis
        client: redisClient,
    }),
    secret: 'Domo Arigato',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by'); //fixes security flaw
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    console.log('Missing CSRF token');
    return false;
});


router(app);

app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
});