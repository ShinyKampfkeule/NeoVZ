var express = require('express');
var router = express.Router();
var driver = require('../neo4j')

/* GET home page. */
router.post('/', async function(req, res, next) {

  const {personalid: personalid} = req.body

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  try {
    const result = await session.writeTransaction(tx =>
      tx.run(
        'MATCH (p:Person {personalid: $personalid}) DETACH DELETE p',
        { personalid: personalid }
      )
    )
  } finally {
    res.redirect('/')
    await session.close()
  }
});

module.exports = router;