const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const Tag = require('./tag');
const Task = require('./task');
const User = require('./user');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  'mongodb://127.0.0.1:27017/dailyTask';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/getTagData', (req, res) => {
  Tag.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/getTaskData', (req, res) => {
  Task.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/getUserData', (req, res) => {
  User.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteTag', (req, res) => {
  const { id } = req.body;
  Tag.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.delete('/deleteTask', (req, res) => {
  const { id } = req.body;
  Task.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/putTagData', (req, res) => {
  let data = new Tag();

  const { id, tag } = req.body;

  if ((!id && id !== 0) || !tag) {
    console.log("dfasdfasdfasdf");
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.tag = tag;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/putTaskData', (req, res) => {
  let data = new Task();

  const { id, taskName, tag, startDate, endDate } = req.body;

  if ((!id && id !== 0) || !taskName || !tag || !startDate || !endDate) {
    console.log("dfasdfasdfasdf");
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.taskName = taskName
  data.tag = tag;
  data.startDate = startDate;
  data.endDate = endDate;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/putUserData', (req, res) => {
  let data = new User();

  const { id, firstName, lastName, dob, gender,emailAddress,phoneNumber,password } = req.body;

  if ((!id && id !== 0) || !firstName || !lastName || !dob || !gender || !emailAddress || !phoneNumber || !password) {
    console.log("dfasdfasdfasdf");
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.firstName = firstName
  data.lastName = lastName;
  data.dob = dob;
  data.gender = gender;
  data.emailAddress = emailAddress;
  data.phoneNumber = phoneNumber;
  data.password = password;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));