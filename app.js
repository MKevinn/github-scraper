const express = require("express");
const cheerio = require("cheerio");
const superagent = require('superagent');

const app = express();

app.get('/:q', function (req, res, next) {
    const url = 'https://github.com/search?q=' + req.params.q;
    superagent.get(url)
      .end(function (err, response) {
        if (err) {
          return next(err);
        }
        const $ = cheerio.load(response.text);
        let items = [];
        $('.mt-n1').each((i,el) => {
            const item = $(el).find('.text-normal').find('.v-align-middle');
            const url = new URL('https://github.com' + item.attr('href'));
            items.push({
                title: item.text().trim(),
                link: url,
                detail: $(el).find('.mb-1').text().trim()
            })
        });
        
        res.send(items);
    });
});

app.listen(3000, function(req,res){
    console.log("app is running on port 3000");
});