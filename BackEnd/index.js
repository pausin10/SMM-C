const express = require("express");
const router = require("router");

const app = express();


app.set('port', process.env.PORT || 3000);


app.use('', require('./routes/routes'));

app.listen(app.get('port'), () => {
    console.log(`Server on ${app.get('port')}`);
});