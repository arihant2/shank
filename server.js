import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import favicon from 'serve-favicon';

import routes from './backend/routes/index.js';
import { errLogsUtility } from './backend/utils/errHandling/errLogs.js';

if(config().error) errLogsUtility.error(config().error.message);

const app = express();

app.use(express.json({ limit: "1mb" }));        // parse json data coming from frontend
app.use(express.urlencoded({ extended: "false" }));     // parse data sent thru html form

app.use(favicon('backend/favicon.ico'));   // serve req: '/favicon.ico' & set favicon for all pgs

// frontend
// app.set('view engine','ejs');
// app.set('views','frontend/views');   // set default views directory
// app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files

app.use('/',routes);

const { HOST:host='localhost', PORT:port=6000, DB_CON:dbUrl } = process.env;

mongoose.connect(
    dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }
).then(() => {
    app.listen(port);
    console.log(`Connection is established at \nhttp://${host}:${port} OR \nhttps://shank.herokuapp.com/\n`);
}).catch(err => errLogsUtility.error(err.message));

// mongoose.set('useFindAndModify',false);

