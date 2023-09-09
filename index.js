const express = require("express");
const dotenv = require('dotenv');
const urlRoute = require("./routes/url");
const mongoose = require("mongoose");
const URL = require("./models/url");
const cors = require('cors');
const cron = require('node-cron');
dotenv.config();
mongoose.set("strictQuery", true);

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true}, () => 
    console.log("Mongo Connected"));

app.use(express.json());
app.use(cors());
app.use('/', urlRoute);

app.get('/:id', async (req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const entry = await URL.findOne(
        {
            shortened_url: fullUrl
        }
    );
    res.redirect(entry.destination);

})
app.listen(PORT, () => console.log("Server connected at port", PORT));

// CRON
const schedule = () => {
    const cronJobPattern = '0 */2 * * *'; // This will run the task every 2 hours

    const cronTask = async () => {
        try {
            console.log('Deleting Shortened URLs...');
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            const deletedURLs = await URL.deleteMany({
                createdAt: { $lt: oneDayAgo }
            });
            console.log(`Deleted ${deletedURLs.deletedCount} Shortened URLs.`);
        } catch (error) {
            console.error('An error occurred while deleting Shortened URLs:', error);
        }
    };

    cron.schedule(cronJobPattern, cronTask);
};

schedule();