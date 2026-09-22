const express = require('express');
const fs = require('fs');
const path = require('path');
const commentRouter = express.Router();

const dbPath = path.join(__dirname, '../data.json');

const readData = () => {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
};

const writeData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

commentRouter.route('/')
    //get all comment
    .get(async (req, res) => {
        try {
            const data = readData();
            res.status(200).json(data.comments);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

    //add a new comment
    .post(async (req, res) => {
        const data = readData();
        try {
            const data = readData();
            const articleId = parseInt(req.body.articleId);
            const newComment = {
                id: data.comments.length > 0 ? data.comments[data.comments.length - 1].id + 1 : 1,
                articleId: articleId,
                author: req.body.author,
                content: req.body.content,
                date: req.body.date
            };
            const article = data.articles.find(a => a.id === articleId)
            if (article) {
                data.comments.push(newComment);
                writeData(data);
                return res.status(201).json({ message: 'Added successful' });
            }
            res.status(404).json({ message: "Not found" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

commentRouter.route('/:id')

    //get a comment by id
    .get(async (req, res) => {
        const data = readData();
        const id = parseInt(req.params.id);
        const comment = data.comments.find(a => a.id === id);
        if (!comment) {
            return res.status(404).json({ message: `Comment ${id} not found` });
        }
        res.status(200).json(comment);
    })

    //update a comment
    .put(async (req, res) => {
        const data = readData();
        const id = parseInt(req.params.id);
        const index = data.comments.findIndex(a => a.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Not Found" });
        }
        data.comments[index] = {
            ...data.comments[index],
            author: req.body.author,
            content: req.body.content,
            date: req.body.date
        };
        writeData(data);
        res.status(200).json({ message: "update successful" });
    })

    //delete a comment
    .delete(async (req, res) => {
        const data = readData();
        const id = parseInt(req.params.id);
        const index = data.comments.findIndex(a => a.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Not Found" });
        }
        data.comments.splice(index, 1);
        writeData(data);
        res.status(200).json({ message: "Delete successful" });
    });

module.exports = commentRouter;