const express = require("express");
const dotenv = require('dotenv');
const urlRoute = require("./routes/url");
const mongoose = require("mongoose");
const URL = require("./models/url");
const cors = require('cors');
dotenv.config();
mongoose.set("strictQuery", true);

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true}, () => 
    console.log("Mongo Connected"));

app.use(express.json());
app.use(cors());
app.use('/g', urlRoute);

app.get('/g/:id', async (req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const entry = await URL.findOne(
        {
            shortened_url: fullUrl
        }
    );
    res.redirect(entry.destination);

})
app.listen(PORT, () => console.log("Server connected at port", PORT));