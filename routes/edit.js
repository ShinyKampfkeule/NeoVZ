var express = require('express');
var router = express.Router();
var driver = require('../neo4j')

/* GET home page. */
router.post('/', async function(req, res, next) {

  const {id, forename, surname, dateOfBirth, domicile, relation, relationSince, friendsSince} = req.body;

  data = {
    forename: {label: 'Vorname', name: 'forename', value: forename, type: 'text'},
    surname: {label: 'Nachname', name: 'surname', value: surname, type: 'text'},
    dateOfBirth: {label: 'Geburtsdatum', name: 'dateOfBirth', value: dateOfBirth, type: 'date'},
    domicile: {label: 'Wohnort', name: 'domicile', value: domicile, type: 'text'},
    relation: {label: 'Beziehung', name: 'relation', value: relation, type: 'text'},
    relationSince: {label: 'Beziehung seit', name: 'relationSince', value: relationSince, type: 'date'},
    friendsSince: {label: 'Freunde seit', name: 'friendsSince', value: friendsSince, type: 'date'}
  }

  res.render('edit', {data: data, id: id});

});

router.post('/save', async function (req, res, next) {

  const {id, forename, surname, dateOfBirth, domicile, relation, relationSince, friendsSince} = req.body;

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  try {
    await session.writeTransaction(tx =>
      tx.run(
        'MATCH (p:Person {id: $id}) SET p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.domicile = $domicile, p.relation = $relation, p.relationSince = $relationSince, p.friendsSince = $friendsSince RETURN p',
        {id: id, forename: forename, surname: surname, dateOfBirth: dateOfBirth, domicile: domicile, relation: relation, relationSince: relationSince, friendsSince: friendsSince}
      )
    )
  } finally {
    res.redirect('/')
    await session.close()
  }

})

module.exports = router;