const Base62Str = require("base62str").default;
const md5 = require('../utils/md5');
const generateRandomStr = require("../utils/generateRandomStr")
const selectRandomStr = require('../utils/selectRandomStr')
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const base62 = Base62Str.createInstanceWithInvertedCharacterSet();
  const urlHashEncode = base62.encodeStr((md5(req.body.url)))
  const key = generateRandomStr(3)+selectRandomStr(urlHashEncode, 4)
  const fullUrl = req.protocol + '://' + req.get('host');
  const shortenedURL = fullUrl +'/g/'+ key
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required!" });  
  await URL.create({
    shortened_url: shortenedURL,
    destination: body.url,
  });

  return res.json({ shortened_url: shortenedURL });
}

module.exports = {
  handleGenerateNewShortURL,
};  
