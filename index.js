var express = require('express');
var app = express();

//let comments = [];

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async () => {
await Comments.sync();
})();

// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
    // Find all users
    const comments = await Comments.findAll();

    console.log(comments)

    res.render('index', { comments: comments });
});

app.post('/create', async function(req, res) {
    console.log(req.body)
    
    const { content } = req.body

    // Create a new user
    const comment = await Comments.create({ content: content });
    res.redirect('/')
});

app.post('/update/:id', async function(req, res) {
  console.log(req.params)
  console.log(req.body)
  
  const { id } = req.params
  const { content } = req.body
      
  // Change everyone without a last name to "Doe"
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });
  res.redirect('/')
});

app.post('/delete/:id', async function(req, res) {
  console.log(req.params)
  const { id } = req.params
        
  // Delete everyone named "Jane"
  await Comments.destroy({
    where: {
      id: id
    }
  });
  res.redirect('/')
});

app.listen(3000);
console.log('Server is listening on port 3000');