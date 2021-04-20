const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
// const { validator } = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash  = require('connect-flash');
const passport = require('passport');



const container = require('./container');
const { Router } = require('express');



container.resolve(function(users, _){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/chatapp', { useNewUrlParser: true, useUnifiedTopology: true });

    const app = SetupExpress();
    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function(){
            console.log('Server started on port 3000');
        });
        ConfigureExpress(app);

        // Setup Router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);

    }



    function ConfigureExpress(app){

        require('./passport/passport-local');


        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
    
        // app.use(validator());
        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            // store: new MongoStore({mongooseConnection: mongoose.connection})
            store: MongoStore.create({
                mongoUrl: 'mongodb://localhost/chatapp'
            })
        }));


        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());


        app.locals._ = _;
    }

});




