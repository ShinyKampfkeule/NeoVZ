let express = require('express');
let router = express.Router();
let driver = require('../neo4j')

router.get('/', async function (req, res, next) {

  // add Code to get User

  if (user.records.length !== 0) {
    res.redirect(`/neovz`)
    // add Code to close Session
  } else {
    res.render('login');
    // add Code to close Session
  }

})

router.post('/login', async function (req, res, next) {

  const {forename, surname} = req.body
  // add Code to get Driver and create Session

  let gen_id = () => {
    let str4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return str4() + str4() + '-' + str4() + '-' + str4() + '-' + str4() + '-' + str4() + str4() + str4()
  }

  try {
    // add Code to save User in DB
  } finally {
    res.redirect('/neovz');
    // add Code to close Session
  }
})

module.exports = router;