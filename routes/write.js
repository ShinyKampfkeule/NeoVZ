let express = require('express');
let router = express.Router();
let driver = require('../neo4j')

router.post('/', async function(req, res, next) {

  const {personalid, forename, surname, dateOfBirth, department, position} = req.body;

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  const ebenen = {
    ebene1: ['Geschäftsführung'],
    ebene2: ['stellv. Geschäftsführung']
  }

  try {
    const result = await session.writeTransaction(tx =>
      tx.run(
       'CREATE (p:Person) SET p.personalid = $personalid, p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.department = $department, p.position = $position RETURN p',
        { personalid: personalid, forename: forename, surname: surname, dateOfBirth: dateOfBirth, department: department, position: position }
      )
    )
  } finally {
    res.redirect('/');
    await session.close()
  }
});

module.exports = router;