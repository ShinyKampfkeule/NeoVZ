let express = require('express');
let router = express.Router();
let driver = require('../neo4j')

router.get('/', async function(req, res, next) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()
  const {searchPosition} = req.query

  let persons = []
  let searchString

  try {
    if ((searchPosition === undefined || (searchPosition === ''))) {
      searchString = 'MATCH (n:Person) RETURN n'
    } else {
      searchString = `MATCH (p:Person {position: "${searchPosition}"}) RETURN p`
    }

    const result = await session.readTransaction(tx =>
      tx.run(searchString)
    )
    result.records.forEach(record => {
      let person = {
        id: record['_fields'][0]['identity']['low'],
        personalid: record['_fields'][0]['properties']['personalid'],
        forename: record['_fields'][0]['properties']['forename'],
        surname: record['_fields'][0]['properties']['surname'],
        dateOfBirth: record['_fields'][0]['properties']['dateOfBirth'],
        department: record['_fields'][0]['properties']['department'],
        position: record['_fields'][0]['properties']['position']
      }
      persons.push(person)
    })
  } finally {
    res.render('index', { persons: persons });
  }
});

module.exports = router;