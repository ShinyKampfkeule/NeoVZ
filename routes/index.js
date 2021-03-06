let express = require('express');
let router = express.Router();
let driver = require('../neo4j')
const dummyData = require("../public/json/dummy_data.json");

let searchString, user

router.get('/', async function(req, res) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()
  const {search, categorie} = req.query

  console.log(search)
  console.log(categorie)

  let persons = []
  let relations = []
  let today = new Date().toISOString().split('T')[0]

  try {

    switch (categorie) {
      case ('relation'):
        searchString = `MATCH p=()-[r:IS_${search.replace(/\s+/g, "_").toUpperCase()}_OF]->() RETURN p`
        break
      default:
        searchString = 'MATCH (n:Person) RETURN n'
        break
    }

    const result = await session.readTransaction(tx =>
      tx.run(searchString)
    )
    result.records.forEach(record => {
      if (categorie !== undefined) {
        if (!record['_fields'][0]['start']['properties']['user']) {
          let person = {
            id: record['_fields'][0]['start']['properties']['id'],
            forename: record['_fields'][0]['start']['properties']['forename'],
            surname: record['_fields'][0]['start']['properties']['surname'],
            dateOfBirth: record['_fields'][0]['start']['properties']['dateOfBirth'],
            domicile: record['_fields'][0]['start']['properties']['domicile'],
            relation: record['_fields'][0]['start']['properties']['relation'],
            relationSince: record['_fields'][0]['start']['properties']['relationSince'],
            friendsSince: record['_fields'][0]['start']['properties']['friendsSince']
          }
          persons.push(person)
        } else {
          user = {
            forename: record['_fields'][0]['start']['properties']['forename'],
            surname: record['_fields'][0]['start']['properties']['surname']
          }
        }
      } else {
        if (!record['_fields'][0]['properties']['user']) {
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
        } else {
          user = {
            forename: record['_fields'][0]['properties']['forename'],
            surname: record['_fields'][0]['properties']['surname']
          }
        }
      }
    })

    const rel = await session.readTransaction(tx =>
      tx.run(
        'MATCH (n) WHERE EXISTS (n.relation) RETURN DISTINCT "node" as entity, n.relation AS relation UNION ALL MATCH ()-[r]-() WHERE EXISTS (r.relation) RETURN DISTINCT "relationship" AS entity, r.relation AS relation'
      )
    )

    rel.records.forEach(record => {
      relations.push(record['_fields'][1])
    })

  } finally {
    res.render('index', { persons: persons, date: today, user: user, relations: relations });
  }
});


router.post('/saveFriend', async function(req, res) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()
  const {forename, surname, dateOfBirth, domicile, relation, relationSince, friendsSince} = req.body;

  console.log(forename)

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
        'MATCH (user:Person {user: $user}) ' +
          'CREATE (p:Person) SET p.id = $id, p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.domicile = $domicile, p.relation = $relation, p.relationSince = $relationSince, p.friendsSince = $friendsSince ' +
          `CREATE (p)-[rel: IS_${relation.replace(/\s+/g, "_").toUpperCase()}_OF]->(user)`,
        {id: gen_id(), forename: forename, surname: surname, dateOfBirth: dateOfBirth, domicile: domicile, relation: relation, relationSince: relationSince, friendsSince: friendsSince, user: true}
      )
    )
  } finally {
    res.redirect('/neovz');
    await session.close()
  }
});


router.post('/deleteFriend', async function(req, res) {

  const {id: id} = req.body

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  try {
    await session.writeTransaction(tx =>
      tx.run(
        'MATCH (p:Person {id: $id}) DETACH DELETE p',
        {id: id}
      )
    )
  } finally {
    res.redirect('/neovz')
    await session.close()
  }
});

router.post('/saveMany', async function (req, res) {

  const dummyData = require('../public/json/dummy_data.json')

  try {
    dummyData.map(entry => {
      let gen_id = () => {
        let str4 = () => {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        }
        return str4() + str4() + '-' + str4() + '-' + str4() + '-' + str4() + '-' + str4() + str4() + str4()
      }

      writeData(entry, gen_id())

    })
  } finally {
    res.redirect('/neovz');
  }

})

async function writeData (entry, gen_id) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  try {
    await session.writeTransaction(tx =>
      tx.run(
        'MATCH (user:Person {user: $user}) ' +
        'CREATE (p:Person) SET p.id = $id, p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.domicile = $domicile, p.relation = $relation, p.relationSince = $relationSince, p.friendsSince = $friendsSince ' +
        `CREATE (p)-[rel: IS_${entry.relation.replace(/\s+/g, "_").toUpperCase()}_OF]->(user)`,
        {id: gen_id, forename: entry.forename, surname: entry.surname, dateOfBirth: entry.dateOfBirth, domicile: entry.domicile, relation: entry.relation, relationSince: entry.relationSince, friendsSince: entry.friendsSince, user: true}
      )
    )
  } finally {
    session.close()
  }

}

module.exports = router;