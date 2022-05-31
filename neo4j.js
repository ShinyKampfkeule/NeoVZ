var neo4j = require('neo4j-driver')

let driver

module.exports = {
  initDriver: function (uri, username, password) {
    // add Code to start Driver
  },

  getDriver: function () {
    return driver
  },

  closeDriver: function () {
    return driver && driver.close()
  }

}