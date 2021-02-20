const express = require('express');
const app = express();
const route = require("./routes");

app.set('view engine', 'pug');
app.use('/', route);

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

