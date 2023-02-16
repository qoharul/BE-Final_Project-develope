const { ProfileUser, User } = require("../models");
const cloudinary = require("../config/cloudinary.config");

class ProfileController {
  static async getProfile(req, res, next) {
    try {
      const userProfile = await ProfileUser.findOne({
        where: {
          user_id: req.user.id,
        },
        include: {
          model: User,
          attributes: ["id", "email", "createdAt", "updatedAt"],
        },
      });
      {
        res.status(200).json({
          statusCode: "200",
          status: "Get Profile",
          message: "Successfully get profile",
          userProfile,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      let image_cloudinary
      if (req.file != null){
        image_cloudinary = await cloudinary.uploader.upload(req.file.path, {
          // resource_type: "image",
          public_id: `second-hand/user-images/${req.body.nama}/${req.file.filename}`,
        });
      }
      

      const user = await ProfileUser.findOne({
        where: {
          user_id: req.user.id,
        }
      })
      const imageUser = user.image_url

      const updateProfileUser = await ProfileUser.update(
        {
          nama: req.body.nama,
          kota: req.body.kota,
          alamat: req.body.alamat,
          no_handphone: req.body.no_handphone,
          // image_url: `http://localhost:3000/images/${req.file.filename}`,
          image_url: req.file !== null ? image_cloudinary?.secure_url : imageUser
        },
        {
          where: {
            user_id: req.user.id,
          },
        }
      );
      res.status(200).json({
        statusCode: "200",
        status: "Updated",
        message: "Successfully update profile",
        updateProfileUser,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProfileController;
