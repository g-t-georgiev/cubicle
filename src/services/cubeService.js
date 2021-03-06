const Cube = require('../models/Cube');
const Accessory = require('../models/Accessory');

const get = (id) => Cube.findById(id).populate('accessories').lean();

const getAll = () => Cube.find({}).lean();

const create = (name, description, imageUrl, difficulty, creatorId) => Cube.create({ name, description, imageUrl, difficulty, creatorId });

const edit = (id, data) => Cube.findByIdAndUpdate(id, { ...data }, { runValidators: true });

const remove = (id) => Cube.findByIdAndDelete(id);

const search = async function (searchText, from, to) {
    searchText = searchText.toLowerCase();

    const fieldsEmpty = !(searchText || from || to);
    // console.log(fieldsEmpty);

    if (fieldsEmpty) return [];

    let results = await getAll() ?? [];

    if (searchText) {
        results = results.filter(v => {
            let name = v.name;
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

    return results.map(cube => {
        const { name } = cube;
        cube.name = name[0] + name.slice(1);
        return cube;
    });;
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