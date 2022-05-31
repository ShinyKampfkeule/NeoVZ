var express = require('express');
var router = express.Router();
var driver = require('../neo4j')


router.post('/', async function(req, res) {

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


router.post('/save', async function (req, res) {

  const {id, forename, surname, dateOfBirth, domicile, relation, relationSince, friendsSince} = req.body;

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  try {
    const toEditUser = await session.readTransaction(tx =>
      tx.run(
        'MATCH (p:Person {id: $id}) RETURN p',
        {id: id}
      )
    )

    await session.writeTransaction(tx =>
      // add Code to create writeTransaction to delete a specific relation
    )

    await session.writeTransaction(tx =>
    // add Code to create writeTransaction to add a new Friend with an relation
  } finally {
    res.redirect('/')
    await session.close()
  }

})

module.exports = router;