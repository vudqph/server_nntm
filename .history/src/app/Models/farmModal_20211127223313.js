const db = require("../../config/db");

module.exports = {
  // Đẩy dữ liệu từ cảm biến vào database
  createFarm: (farms, callback) => {
    db.query(
      `INSERT INTO farms (personID, deviceID, treeID, farmName,location,area,timeStart,timeFinish) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        farms.personID,
        farms.deviceID,
        farms.treeID,
        farms.farmsName,
        farms.location,
        farms.area,
        farms.timeStart,
        farms.timeFinish,
      ],
      (err, results, fields) => {
        if (err) {
          callback(err);
        }
        return callback(null, results);
      }
    );
  },
  getDataFarmByID: (userID, callback) => {
    db.query(
      `SELECT farmName, location,area,timeStart,timeFinish from farms where BIN_TO_UUID(farms.personID) = ?;`,
      [userID],
      (err, results, fields) => {
        if (err) {
          return callback(err);
        }
        return callback(null, results);
      }
    );
  },
};
