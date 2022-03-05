const express = require('express');
const app = express();
const connectToMongoose = require('./db');
connectToMongoose()
const port = 4000;

// middlewire
app.use(express.json());

// Routes
app.use('/api/user',require('./routes/user'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})