var neo4j = require('neo4j-driver')

let driver

module.exports = {
  initDriver: function (uri, username, password) {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password))

    return driver.verifyConnectivity()
      .then(() => driver)
  },

  getDriver: function () {
    return driver
  },

  closeDriver: function () {
    return driver && driver.close()
  }

}