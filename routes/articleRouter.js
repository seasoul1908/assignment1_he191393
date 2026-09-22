const express = require('express');
const fs = require('fs');
const path = require('path');
const articleRouter = express.Router();

const dbPath = path.join(__dirname, '../data.json');

const readData = () => {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
};

const writeData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};


articleRouter.route('/')
    //get all article
    .get(async (req, res) => {
        try {
            const data = readData();
            res.status(200).json(data.articles);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

    //add new article
    .post(async (req, res) => {
        try {
            const data = readData();
            const newArticle = {
                id: data.articles.length > 0 ? data.articles[data.articles.length - 1].id + 1 : 1,
                title: req.body.title,
                content: req.body.content,
                author: req.body.author,
                date: req.body.date,
            };
            data.articles.push(newArticle);
            writeData(data);
            res.status(200).json({ message: 'Added successful' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

articleRouter.route('/:id')
    //get artical by id
    .get(async (req, res) => {
        const data = readData();
        const id = parseInt(req.params.id);
        const article = data.articles.find(a => a.id === id);
        if (!article) {
            return res.status(404).json({ message: `Article ${id} not found` });
        }
        res.status(200).json(article);
    })

    //update article
    .put(async (req, res) => {
        const data = readData();
        const id = parseInt(req.params.id);
        const index = data.articles.findIndex(a => a.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Not Found" });
        }
        data.articles[index] = {
            ...data.articles[index],
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            date: req.body.date
        };
        writeData(data);
        res.status(200).json({ message: "update successful" });
    })

    //delete an article
    .delete(async (req, res) => {
        const data = readData();
        const id = parseInt(req.params.id);
        const index = data.articles.findIndex(a => a.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Not Found" });
        }
        data.articles.splice(index, 1);
        writeData(data);
        res.status(200).json({ message: "Delete successful" });
    });

module.exports = articleRouter;