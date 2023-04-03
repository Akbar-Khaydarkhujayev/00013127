let fs = require('fs')
const {v4 : uuidv4} = require("uuid")
const { body, validationResult } = require('express-validator');

let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
    res.render('users-table', { users: hidePassword(getAll())})
})


router.route('/create')
    .get((req, res) => {
        res.render('register-user')
    })
    .post(body('email').isEmail(),
        body('name').isLength({ min: 3 }),
        body('surname').isLength({ min: 3 }),
        body('password').isLength({ min: 8 }),(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.errors.forEach(e => console.log(e.param + " field:" + e.msg))
        }else {
            let users = getAll()

            users.push({
                id: uuidv4(),
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password
            })

            saveAll(users)

            res.redirect('/users')
        }
    })


router.delete('/delete', (req, res) => {
    
    let users = getAll()

    let leftUsers = removeUser(req.body.id, users);

    saveAll(leftUsers)

    res.json({ deleted: true })
})


router.route('/update/:id')
    .get((req, res) => {
        let users = getAll();
        res.render('update-user', { user: findUser(req.params.id, users)})
    })
    .put((req, res) => {
            let users = getAll()

            let index = users.indexOf(findUser(req.params.id, users))

            users[index].name = req.body.data.name
            users[index].surname = req.body.data.surname
            users[index].email = req.body.data.email

            saveAll(users)

            res.json({ updated: true })
    })

function  getAll() {
    return JSON.parse(fs.readFileSync(`./data/users.json`))
}

function  hidePassword(users) {
    for(let i = 0;i<users.length;i++){
        users[i].password = `***${users[i].password.slice(-4)}`
    }
    return users
}

function saveAll(data) {
    fs.writeFileSync(`./data/users.json`, JSON.stringify(data))
}

function removeUser(id, users) {
    return users.filter(user => user.id != id)
}

function findUser(id, users) {
    let user;
    for(let i = 0;i<users.length;i++){
        if(users[i].id == id){
            user = users[i]
        }
    }
    return user;
}

module.exports = router


