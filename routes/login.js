let express = require('express');
let router = express.Router();
let driver = require('../neo4j')

router.get('/', async function (req, res, next) {

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  let user = await session.readTransaction(tx =>
    tx.run(
      'MATCH (p:Person {user: $state}) RETURN p' ,
      {state: true}
    )
  )

  if (user.records.length !== 0) {
    res.redirect(`/neovz`)
    await session.close()
  } else {
    res.render('login');
    await session.close()
  }

})

router.post('/login', async function (req, res, next) {

  const {forename, surname} = req.body
  const active_driver = driver.getDriver()
  const session = active_driver.session()

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
        'CREATE (p:Person) SET p.id = $id, p.forename = $forename, p.surname = $surname, p.user = $user RETURN p',
        {id: gen_id(), forename: forename, surname: surname, user: true}
      )
    )
  } finally {
    res.redirect('/neovz');
    await session.close()
  }
})

module.exports = router;