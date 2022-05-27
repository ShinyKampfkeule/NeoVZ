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
      tx.run(
        `MATCH (p:Person {id: $id})-[r:IS_${toEditUser.records[0]['_fields'][0]['properties']['relation'].replace(/\s+/g, "_").toUpperCase()}_OF]->()` +
        `DELETE r`,
        {id: id}
      )
    )

    await session.writeTransaction(tx =>
      tx.run(
        'MATCH (user:Person {user: $user}) ' +
          'MATCH (p:Person {id: $id}) SET p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.domicile = $domicile, p.relation = $relation, p.relationSince = $relationSince, p.friendsSince = $friendsSince ' +
          `CREATE (p)-[rel: IS_${relation.replace(/\s+/g,"_").toUpperCase()}_OF]->(user)`,
        {id: id, forename: forename, surname: surname, dateOfBirth: dateOfBirth, domicile: domicile, relation: relation, relationSince: relationSince, friendsSince: friendsSince, user: true}
      )
    )
  } finally {
    res.redirect('/')
    await session.close()
  }

})

module.exports = router;