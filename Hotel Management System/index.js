const express = require("express");
const path = require("path")
const http = require('http');
const socketIo = require('socket.io');
require("dotenv").config();
require("./database/database");

// var morgan = require('morgan')
const cookieParser = require('cookie-parser')

const port = process.env.port;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// app.use(morgan('short'))
const socketEvents = require('./Socket/socketEvents');

const public = path.join(__dirname, "public");
app.use(express.static(public));

app.use(express.urlencoded({ extended: false }))

app.set("view engine", "hbs")

app.use(cookieParser());
//Below are get routes used to define routes without any logical operations
app.use(
    "/",
    [
        require("./Routes/GET/login"),
        require("./Routes/GET/register"),
        require("./Routes/GET/index"),
        require("./Routes/GET/profile"),
        require("./Routes/GET/rooms"),
        require("./Routes/GET/customers"),
        require("./Routes/GET/checkin"),
        require("./Routes/GET/checkout"),
        require("./Routes/GET/oldcheckouts")
    ]
)

//Below are post routes used to perform some operations when hit
app.use(
    "/",
    [
        require("./Routes/POST/logout"),
        require("./Routes/POST/register"),
        require("./Routes/POST/login"),
        require("./Routes/POST/updateprofile"),
        require("./Routes/POST/changepassword")
    ]
)

// Load socket event handlers
socketEvents(io);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})