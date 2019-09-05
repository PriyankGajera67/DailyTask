import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TagAutoCompleteField from './TagAutoCompleteField';
import MaterialUIPickers from './MaterialUIPickers';
import List from '@material-ui/core/List';
import './LogTask.css';
import axios from 'axios';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.primary,
  },
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
    padding: '0 30px',
  },
  paper: {
    padding: '30px 30px',
    margin: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const ValidationTextField = withStyles({
  root: {
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important', // override inline-style
    },
  },
})(TextField);

export default class LogTask extends React.Component {
  state = {
    data: [],
    id: 0,
    taskName: null,
    tag: [],
    startDate:null,
    endDate:null,
    intervalIsSet: false,
    objectToUpdate: null,
  };


  callbackFunction = (childData) => {
    console.log("in parent");
    const tagList = [];
    childData.map(e => tagList.push(e.label));
    this.setState({ tag: tagList })
  }

  callbackStartDateFunction = (data) => {
    console.log("in Startdate",data);
    this.setState({ startDate: data });
  }

  callbackEndDateFunction = (data) => {
    console.log("in Enddate",data);
    this.setState({ endDate: data })
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getTaskData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };


  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteTag', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putTagDataToDB = (taskName, tag, startDate, endDate) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putTaskData', {
      id: idToBeAdded,
      taskName: taskName,
      startDate: startDate,
      endDate: endDate,
      tag: tag,
    });
  };


  onGreet() {
    alert('hello');
  }

  render() {
    const { data } = this.state;
    return (
      <div>

        <Container fixed>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <List component="nav" className={useStyles.list} aria-label="mailbox folders">


                {data.length <= 0

                  ? 'NO!! Task Added till now'

                  : data.map((dat) => (
                    <div className="task">
                      <h4>{dat.taskName}</h4>

                      <p>  {new Intl.DateTimeFormat('en-GB', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                      }).format(new Date(dat.updatedAt))}
                      </p>
                      {/* <p>{ dat.updatedAt }</p> */}
                      {dat.tag.length <= 0 ? 'No Tag' : dat.tag.map((t) => (
                        <div class="tag-chips" style={{ margin: 2 }}>
                          <Chip key={t}
                            label={t}
                            color="primary"
                            className={useStyles.chip}
                          />
                        </div>
                      ))}
                    </div>

                  ))}
              </List>


            </Grid>
            <Grid item xs={6}>

              <form className={useStyles.root} noValidate>
                <ValidationTextField
                  className={useStyles.margin}
                  label="Task Name"
                  required
                  variant="outlined"
                  defaultValue=""
                  fullWidth
                  id="validation-outlined-input"
                  onChange={(e) => this.setState({ taskName: e.target.value })}
                />
                <br />
                <br />
                <MaterialUIPickers parentStartDateCallback={this.callbackStartDateFunction}  parentEndDateCallback={this.callbackEndDateFunction}/>
                <TagAutoCompleteField parentCallback={this.callbackFunction} />

                <Button variant="contained" color="primary" onClick={() => this.putTagDataToDB(this.state.taskName, this.state.tag,this.state.startDate,this.state.endDate)} className={useStyles.button}>
                  Add Task
                          </Button>
              </form>

            </Grid>
          </Grid>
          <br></br>

        </Container>

      </div>
    );
  }
}