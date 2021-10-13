const Accessory = require('../models/Accessory');

const getAll = () => Accessory.find({}).lean();

const create = (name, description, imageUrl) => Accessory.create({name, description, imageUrl});

const getAllWithout = (accessoryIds) => Accessory.find({'_id': { $nin: accessoryIds }}).lean();

module.exports = {
    getAll,
    getAllWithout,
    create
};