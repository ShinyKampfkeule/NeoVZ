var express = require('express');
var router = express.Router();
var driver = require('../neo4j')

/* GET home page. */
router.post('/', async function(req, res, next) {

  const {id, personalid, forename, surname, dateOfBirth, department, position} = req.body;

  data = {
    id: {label: 'id', value: id, type: 'hidden'},
    personalid: {label: 'personalid', value: personalid, type: 'number'},
    forename: {label: 'forename', value: forename, type: 'text'},
    surname: {label: 'surname', value: surname, type: 'text'},
    dateOfBirth: {label: 'dateOfBirth', value: dateOfBirth, type: 'date'},
    department: {label: 'department', value: department, type: 'text'},
    position: {label: 'position', value: position, type: 'text'}
  }

  res.render('edit', {data: data});

});

router.post('/save', async function (req, res, next) {

  const {id, personalid, forename, surname, dateOfBirth, department, position} = req.body;

  const active_driver = driver.getDriver()
  const session = active_driver.session()

  try {
    const result = await session.writeTransaction(tx =>
      tx.run(
        'MATCH (p) WHERE id(p) = $id SET p.personalid = $personalid, p.forename = $forename, p.surname = $surname, p.dateOfBirth = $dateOfBirth, p.department = $department, p.position = $position RETURN p',
        { id: parseInt(id), personalid: personalid, forename: forename, surname: surname, dateOfBirth: dateOfBirth, department: department, position: position }
      )
    )
  } finally {
    res.redirect('/')
    await session.close()
  }

})

module.exports = router;