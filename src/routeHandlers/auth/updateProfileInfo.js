const _ = require("lodash");
const { mySqlConn } = require("../../utils/db");

module.exports.updateProfileInfo = async (req, res) => {
  try {
    const { email, name } = req.body;

    console.log("Email and Name", email, name);

    if (email === "" || email === null) {
      return res.status(400).send({ message: "Email cannot be null." });
    }

    let toBeUpdatedFields = {};

    _.forIn(req.body, (val, key) => {
      if (!_.isEmpty(val)) {
        toBeUpdatedFields[key] = val;
      }
    });

    if (!_.isEmpty(toBeUpdatedFields)) {
      const db = await mySqlConn();
      //perporm db operations
      const sqlSetValues = [];
      _.forIn(toBeUpdatedFields, (val, key) => {
        sqlSetValues.push(`${key}=${db.escape(val)}`); //['title='shhss'', 'description='adjdhwqjd'']
      });

      const sqlSetString = _.toString(sqlSetValues);

      const sqlUpdateStatement = `UPDATE users SET ${sqlSetString} WHERE userId=${db.escape(
        req.user.userId
      )}`;
      await db.query(sqlUpdateStatement);
    }

    return res.json({ ...toBeUpdatedFields });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Oops something went wrong." });
  }
};
