const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const imgsRoutes = require('./routes/imgs');
const uploadRoutes = require('./routes/upload');
const errorController = require('./controllers/error');
// import {router as upload} from "./api/upload";
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/img', imgsRoutes);
app.use('/upload', uploadRoutes);
// //Uploads
// app.use("/upload", upload);
// app.use("/uploads", express.static("uploads"));

app.use(errorController.get404);
app.use(errorController.get500);


app.listen(port, () => console.log(`Server is running on port ${port}`));
