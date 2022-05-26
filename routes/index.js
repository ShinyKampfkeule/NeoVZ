let express = require('express');
let router = express.Router();
let driver = require('../neo4j')


router.get('/', async function(req, res, next) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()
  const {searchPosition} = req.query

  let persons = []
  let searchString
  let today = new Date().toISOString().split('T')[0]

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
        id: record['_fields'][0]['properties']['id'],
        forename: record['_fields'][0]['properties']['forename'],
        surname: record['_fields'][0]['properties']['surname'],
        dateOfBirth: record['_fields'][0]['properties']['dateOfBirth'],
        domicile: record['_fields'][0]['properties']['domicile'],
        relation: record['_fields'][0]['properties']['relation'],
        relationSince: record['_fields'][0]['properties']['relationSince'],
        friendsSince: record['_fields'][0]['properties']['friendsSince']
      }
      persons.push(person)
    })
  } finally {
    res.render('index', { persons: persons, date: today });
  }
});


router.post('/saveFriend', async function(req, res, next) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()
  const {forename, surname, dateOfBirth, domicile, relation, relationSince, friendsSince} = req.body;

  let gen_id = () => {
    let str4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return str4() + str4() + '-' + str4() + '-' + str4() + '-' + str4() + '-' + str4() + str4() + str4()
  }

  try {
    await session.writeTransaction(tx =>
      tx.run(
        'CREATE (p:Person) SET p.id = $id, p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.domicile = $domicile, p.relation = $relation, p.relationSince = $relationSince, p.friendsSince = $friendsSince RETURN p',
        {id: gen_id(), forename: forename, surname: surname, dateOfBirth: dateOfBirth, domicile: domicile, relation: relation, relationSince: relationSince, friendsSince: friendsSince}
      )
    )
  } finally {
    res.redirect('/');
    await session.close()
  }
});


router.post('/deleteFriend', async function(req, res, next) {

  const {id: id} = req.body

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  console.log(id)

  try {
    await session.writeTransaction(tx =>
      tx.run(
        'MATCH (p:Person {id: $id}) DETACH DELETE p',
        {id: id}
      )
    )
  } finally {
    res.redirect('/')
    await session.close()
  }
});

module.exports = router;