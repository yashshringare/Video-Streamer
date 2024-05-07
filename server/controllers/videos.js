const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const mongoose = require('mongoose');
const moment = require('moment');
const express = require('express');
const fs = require('fs');
const path = require('path');
const thumbsupply = require('thumbsupply');

const videos = [
    {
        id: 0,
        poster: '/videos/0/poster',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_.jpg',
        duration: '3 mins',
        name: 'Sample 1'
    },
    {
        id: 1,
        poster: '/videos/1/poster',
        poster_url: 'https://asset.cloudinary.com/dng1fxwgg/0d3cb75da2f3fa17577ee2048c25d8ca',
        duration: '4 mins',
        name: 'Sample 2'
    },
    {
        id: 2,
        poster: '/videos/2/poster',
        poster_url: 'https://asset.cloudinary.com/dng1fxwgg/0d3cb75da2f3fa17577ee2048c25d8ca',
        duration: '2 mins',
        name: 'Sample 3'
    },
];

const getAllVideos = async (req, res) => {
    res.json(videos);
}

const getSingleVideo = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json(videos[id]);
}

const getSingleVdoStream = async (req, res) => {
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
}

const getVideoPoster = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json(videos[id]);
}

const getVideoCaption = async (req, res) => {
    res.sendFile('assets/captions/sample.vtt', { root: __dirname });
}


module.exports = {
    getAllVideos,
    getSingleVideo,
    getSingleVdoStream,
    getVideoPoster,
    getVideoCaption
}
