const homepageModel = require('../models/homepageModel')

exports.gethomepagedataController = async (req, res, next) => {
    const homepageData = homepageModel.gethomepagedata(req, res)
}

exports.login = (req, res, next) => {
    homepageModel.login(req, res)
}
