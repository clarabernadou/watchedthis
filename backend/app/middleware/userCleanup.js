const db = require("../models");

const User = db.user;

async function cleanupUnverifiedUsers() {
  console.error(User);
  try {
    const unverifiedUsers = await User.findAll({
      where: {
        is_verified: false,
      },
    });

    console.error(unverifiedUsers);

    for (const user of unverifiedUsers) {
      await user.destroy();
      console.log(`User deleted: ${user.id}`);
    }
  } catch (error) {
    console.error("User cleanup error:", error);
  }
}

module.exports = cleanupUnverifiedUsers;
