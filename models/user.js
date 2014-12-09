"use strict";

var bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: DataTypes.STRING,
    password_digest: DataTypes.STRING
  }, {
    instanceMethods: {
      checkPassword: function (password) {
        return bcrypt.compareSync(password, this.password_digest);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      findByEmail: function () {
        return this.find({
          where: {
            email: email
          }
        });
      },
      encryptPassword: function (password) {
        var salt = bcrypt.genSaltSync(13);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      createSecure: function (email, password, error, success) {
        var hash = this.encryptPassword(password);
        this.create({
          email: email,
          password_digest: hash
        })
        .then(function (user) {
                    console.log("Whatt?")
          success(user);
        })
        .fail(function (err) {
          console.log("Whatt?")
          console.log(arguments)
          console.log(err)
          error({message: "something went wrong"});
        });
      },
      authenticate: function (email, password, err, success) {
        this.findByEmail(email)
        .then(function (user) {
          if (user.checkPassword(password)) {
            success();
          }
        }).error(function (err) {
          error({message: "Invalid data"});
        })
      }
    }
  });

  return user;
};
