const fs = require("fs");
const db = require("../models");
const Image = db.image;
const GymImage = db.gym_image;

exports.uploadFiles = async (req, res) => {
    try {
        console.log(req.file);
        if (req.file === undefined) {
            return res.status(400).json({
                success: false,
                message: "File must be selected!"
            })
        }
        console.log(req.file);
        const image = await Image.create({
            type: req.file.mimetype,
            name: req.file.originalname,
            // http://localhost:5000/resources/uploads/${images.value.name}
            path: `resources/uploads/${req.file.filename}`
            // data: fs.readFileSync(__basedir + "/resources/static/assets/uploads/" + req.file.filename)
        })
        if (image) {
            console.log(image);
            // fs.writeFileSync(__basedir + "/resources/static/assets/tmp/" + image.name, image.data);
            return res.status(200).json({
                success: true,
                message: "File has been uploaded successfully!"
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getImages = async (req, res) => {
    try {
        const images = await Image.findAll({
            attributes: ['name', 'data', 'path']
        });
        if (images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "There are no images in the database!"
            })
        }
        // const encodedData = images.map((img) => {    TODO: if it doesnt work i should encode the blob

        // })

        return res.status(200).json({
            success: true,
            message: "Images retrieved!",
            images: images
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
exports.uploadGymImage = async (req, res) => {
    const {
        gymId
    } = req.body

    try {
        console.log(req);

        if (req.files === undefined) {
            return res.status(400).json({
                success: false,
                message: "File must be selected!"
            })
        }
        console.log(req.files);
        // const t = await db.sequelize.transaction()
        const images = req.files;
        images.forEach(async (img) => {
            const image = await Image.create({
                type: img.mimetype,
                name: img.originalname,
                path: `resources/uploads/${img.filename}`
            })

            if (image) {
                console.log(image);
                const gymImage = await GymImage.create({
                    gymId: gymId,
                    imageId: image.id
                })
            }
        });
        // const image = await Image.create({
        //     type: req.files.mimetype,
        //     name: req.files.originalname,
        //     // http://localhost:5000/resources/uploads/${images.value.name}
        //     path: `resources/uploads/${req.files.filename}`
        //     // data: fs.readFileSync(__basedir + "/resources/static/assets/uploads/" + req.file.filename)
        // }, {
        //     transaction: t
        // })
        // if (image) {
        //     console.log(image);
        //     const gymImage = await GymImage.create({
        //         gymId: gymId,
        //         imageId: image.id
        //     }, {
        //         transaction: t
        //     })
        //     // fs.writeFileSync(__basedir + "/resources/static/assets/tmp/" + image.name, image.data);
        //     await t.commit();
        // }


        return res.status(200).json({
            success: true,
            message: "File has been uploaded successfully!"
        })
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getAllImagesForGym = async (req, res) => {

    try {
        //TODO: Find all from GymImage where gym_id = input_id HINT: look up instructor controller
        const gymImages = await GymImage.findAll({
            attributes: {
                exclude: ["id", "gymId", "imageId"]
            },
            where: {
                gymId: req.params.gymId
            },
            include: [{
                model: Image,
                required: true
            }]
        })
        if (gymImages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Gym images not found!"
            })

        }
        return res.status(200).json({
            success: true,
            message: "Images retrieved!",
            gymImages: gymImages
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}