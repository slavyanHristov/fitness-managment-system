const checkFileType = (req, res, next) => {
    if (req.hasOwnProperty('file_error')) {
        return res.status(418).json({
            succes: false,
            error: req.file_error
        })
    }
    return next();
}

module.exports = checkFileType