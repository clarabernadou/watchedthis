const db = require("../models");
const config = require("../config/auth.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { randomUUID } = require('crypto');

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

require('dotenv').config();
const gmail_email = process.env.GMAIL_EMAIL;
const gmail_key = process.env.GMAIL_KEY;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: gmail_email,
    pass: gmail_key
  }
});

const sendWelcomeEmail = (email, verificationToken) => {
  const mailOptions = {
    from: gmail_email,
    to: email,
    subject: 'Welcome to Watched This! 🎉',
    html: `<p>Thank you for subscribing to Watched This! 🥳<br />
    <br />
    Please confirm your account by clicking <a href="http://localhost:3000/verify-account/${verificationToken}">here</a> before tomorrow at 12:00 AM to start to build your personal watchlist.<br />
    <br />
    If you fail to meet this deadline, your account will be deleted from our database. 🥲<br />
    <br />
    We're delighted to have you on board,<br />
    <br />
    <table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr><td style="vertical-align: middle;"><table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr><td><h2 color="#000000" class="name__NameContainer-sc-1m457h3-0 jxbGUj" style="margin: 0px; font-size: 18px; color: rgb(0, 0, 0); font-weight: 600;"><span>Clara</span><span>&nbsp;</span><span>Bernadou</span></h2><p color="#000000" font-size="medium" class="job-title__Container-sc-1hmtp73-0 ifJNJc" style="margin: 0px; color: rgb(0, 0, 0); font-size: 14px; line-height: 22px;"><span>Founder of Watched This</span></p></td><td width="15"><div></div></td><td color="#000000" direction="vertical" width="1" height="auto" class="color-divider__Divider-sc-1h38qjv-0 llIisW" style="width: 1px; border-bottom: none; border-left: 1px solid rgb(0, 0, 0);"></td><td width="15"><div></div></td><td><table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr height="25" style="vertical-align: middle;"><td width="30" style="vertical-align: middle;"><table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr><td style="vertical-align: bottom;"><span color="#000000" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 bglVXe" style="display: inline-block; background-color: rgb(0, 0, 0);"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png" color="#000000" alt="emailAddress" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 cnkwri" style="display: block; background-color: rgb(0, 0, 0);"></span></td></tr></tbody></table></td><td style="padding: 0px;"><a href="mailto:bernadouclara@icloud.com" color="#000000" class="contact-info__ExternalLink-sc-mmkjr6-2 ibLXSU" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;"><span>bernadouclara@icloud.com</span></a></td></tr><tr height="25" style="vertical-align: middle;"><td width="30" style="vertical-align: middle;"><table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr><td style="vertical-align: bottom;"><span color="#000000" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 bglVXe" style="display: inline-block; background-color: rgb(0, 0, 0);"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/address-icon-2x.png" color="#000000" alt="address" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 cnkwri" style="display: block; background-color: rgb(0, 0, 0);"></span></td></tr></tbody></table></td><td style="padding: 0px;"><span color="#000000" class="contact-info__Address-sc-mmkjr6-3 jxDmGK" style="font-size: 12px; color: rgb(0, 0, 0);"><span>Morbihan, Bretagne</span></span></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td height="30"></td></tr><tr><td color="#000000" direction="horizontal" width="auto" height="1" class="color-divider__Divider-sc-1h38qjv-0 llIisW" style="width: 100%; border-bottom: 1px solid rgb(0, 0, 0); border-left: none; display: block;"></td></tr><tr><td height="30"></td></tr><tr><td><table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="width: 100%; vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr><td style="vertical-align: top;"><img src="https://drive.google.com/uc?id=1f2wvgCfs5zPHxHcrpaS7oIHQ53jdAaCz" role="presentation" width="130" class="image__StyledImage-sc-hupvqm-0 gYgOut" style="display: block; max-width: 130px;"></td><td style="text-align: right; vertical-align: top;"><table cellpadding="0" cellspacing="0" class="table__StyledTable-sc-1avdl6r-0 kAbRZI" style="display: inline-block; vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;"><tbody><tr style="text-align: right;"><td><a href="https://www.linkedin.com/in/clarabernadou/" color="#000000" class="social-links__LinkAnchor-sc-py8uhj-2 hBVWAh" style="display: inline-block; padding: 0px; background-color: rgb(0, 0, 0);"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/linkedin-icon-2x.png" alt="linkedin" color="#000000" height="24" class="social-links__LinkImage-sc-py8uhj-1 hSTSwA" style="background-color: rgb(0, 0, 0); max-width: 135px; display: block;"></a></td><td width="5"><div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>
    </p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending e-mail :", error);
    } else {
      console.log("E-mail successfully sent :", info.response);
    }
  });
};

exports.signup = (req, res) => {
  const binaryToken = randomUUID();
  const verificationToken = binaryToken.toString('hex');

  const { username, email, password } = req.body;

  User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
    verification_token: verificationToken,
    is_verified: false,
    profilePicture: 'defaultProfilePicture.png',
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            sendWelcomeEmail(email, verificationToken);

            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          sendWelcomeEmail(email, verificationToken);

          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours = 86400
                              });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          roles: authorities,
          authentication_token: token,
          is_verified: user.is_verified
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const profilePicture = req.file;
  const userId = req.params.userId;

  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).send({ message: "User Not found." });
      }

      if (username) {
          user.username = username;
      }
      if (email) {
          user.email = email;
      }
      if (profilePicture) {
          user.profilePicture = profilePicture.filename;
      }

      await user.save();
      res.status(200).send({ message: "User profile updated successfully!" });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
};

exports.getUserById = (req, res) => {
  const userId = req.params.userId;

  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const userData = {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      };

      res.status(200).send(userData);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.verifyAccount = (req, res) => {
  const { token } = req.params;

  User.findOne({
    where: {
      verification_token: token,
    }
  }).then(user => {
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired validation token' });
    }

    user.update({ is_verified: true })
      .then(() => {
        res.json({ message: 'Account successfully validated' });
      })
      .catch(updateError => {
        console.error(updateError);
        res.status(500).json({ message: 'Account update error' });
      });
  }).catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Account validation error' });
  });
};

exports.logout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};