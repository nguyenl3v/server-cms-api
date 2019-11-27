const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

require("./router/reviews")(io);

const fileUpload = require("express-fileupload");

var mongoose = require("mongoose");
const db = require("./config/db").MongoURL;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoose connected"))
  .catch(err => console.log(err));

app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type", "authorization"],
    exposedHeaders: ["sessionId", "authorization"],
    origin: "https://mern-stack-cms.herokuapp.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);
app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const menu = require("./router/menu");
const categories = require("./router/categories");
const slideshow = require("./router/slideshow");
const product = require("./router/product");
const userAdmin = require("./router/userAdmin");
const user = require("./router/user");
const order = require("./router/order");
const blog = require("./router/blog");
const search = require("./router/search");
const footer = require("./router/footer");

app.use("/footer", footer);
app.use("/search", search);
app.use("/blog", blog);
app.use("/order", order);
app.use("/", user);
app.use("/user/admin", userAdmin);
app.use("/admin/product", product);
app.use("/admin/slideshow", slideshow);
app.use("/admin/categories", categories);
app.use("/admin/menu", menu);

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => console.log("started port 4000"));
