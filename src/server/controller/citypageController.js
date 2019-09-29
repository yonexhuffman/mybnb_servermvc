const citypageModel = require('../models/citypageModel')

exports.getcitypagedataController = async (req, res, next) => {
    const citypageData = citypageModel.getcitypagedata(req, res)
}