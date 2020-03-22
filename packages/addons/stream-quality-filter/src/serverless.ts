import addonRouter from './addon';

module.exports = (req, res) => {
    addonRouter(req, res, () => {
        res.statusCode = 404;
        res.end();
    });
};