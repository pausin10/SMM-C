const express = require("express");
const router = require("router");

const app = express();

<<<<<<< HEAD
app.set('port', process.env.PORT || 3000);

=======










app.set('port', process.env.PORT || 3000);

>>>>>>> 0face9e4c2d5eaba1fd50cf2f83ccee7bb5f8676
app.use('', require('./routes/routes'));

app.listen(app.get('port'), () => {
    console.log(`Server on ${app.get('port')}`);
});