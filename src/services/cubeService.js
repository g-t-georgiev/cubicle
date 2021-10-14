const Cube = require('../models/Cube');
const Accessory = require('../models/Accessory');

const get = (id) => Cube.findById(id).populate('accessories').lean();

const getAll = () => Cube.find({}).lean();

const create = (name, description, imageUrl, difficulty, creatorId) => Cube.create({ name, description, imageUrl, difficulty, creatorId });

const edit = (id, data) => Cube.findByIdAndUpdate(id, { ...data });

const remove = (id) => Cube.findByIdAndDelete(id);

const search = async function (searchText, from, to) {
    searchText = searchText.trim().toLowerCase();
    from = Number(from.trim());
    to = Number(to.trim());

    if (isNaN(from) || isNaN(to)) {
        throw new Error('Invalid search parameters for from..to range');
    }

    const fieldsEmpty = !(searchText || from || to);
    // console.log(fieldsEmpty);

    if (fieldsEmpty) return [];

    let results = await getAll();

    if (searchText) {
        results = results.filter(v => {
            let name = v.name?.toLowerCase();
            return name.includes(searchText);
        });
    }

    if (from) {
        results = results.filter(v => {
            let { difficulty } = v;
            return difficulty >= from;
        });
    }

    if (to) {
        results = results.filter(v => {
            let { difficulty } = v;
            return difficulty <= to;
        });
    }

    return results;
};

const addAccessory = async function (cubeId, accessoryId) {
    const cube = await Cube.findById(cubeId);
    const accessory = await Accessory.findById(accessoryId);

    cube.accessories.push(accessory);
    return cube.save();
};

module.exports = {
    get,
    getAll,
    create,
    edit,
    remove,
    search,
    addAccessory
};