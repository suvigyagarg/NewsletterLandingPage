const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(express.static("public"));    //to use static files like css, images, js for our code
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;                       //for body parser fname is the name of that tag in html
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    //api call to mailchimp
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,

                }
            }]
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us13.api.mailchimp.com/3.0/lists/973de96057';
    const options = {
        method: "POST",
        auth: "vaikunth:e8e542e76836a39d7f6d4017f2706ee8-us13"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();

});
//redirecting to home page on post of failure
app.post("/failure", function (req, res) {
    res.redirect("/");});

app.listen(process.env.PORT  || 3000 , function () {        // process.env.PORT is for heroku to listen to any port
    console.log("Server started on port 3000");
});












    //API key
    //e8e542e76836a39d7f6d4017f2706ee8-us13

    //list id
    //973de96057