const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');

app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: "User Rest API is working..." })
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
