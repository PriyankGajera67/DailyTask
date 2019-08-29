import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import axios from 'axios';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
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

export default class Tag extends React.Component {
  state = {
    data: [],
    id: 0,
    tag: null,
    intervalIsSet: false,
    objectToUpdate: null,
  };

  handleDelete = () => {
   // alert('You clicked the delete icon.');
  }

  handleClick = () => {
    //alert('You clicked the Chip.');
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
    fetch('http://localhost:3001/api/getTagData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putTagDataToDB = (tag) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putTagData', {
      id: idToBeAdded,
      tag: tag,
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <div>
          
      {data.length <= 0

        ? 'NO!! Tags Added'

        : data.map((dat) => (
            <Chip key={data.tag}
            avatar={
              <Avatar>
                <FaceIcon />
              </Avatar>
            }
            label={dat.tag}
            onClick={this.handleClick()}
            onDelete={this.handleDelete()}
            className={useStyles.chip}
            />

          ))}
        </div>
        <form className={useStyles.root} noValidate>
          <ValidationTextField
            className={useStyles.margin}
            label="Tag"
            required
            variant="outlined"
            defaultValue=""
            id="validation-outlined-input"
            onChange={(e) => this.setState({ tag: e.target.value })}
          />
          <br />
          <Button variant="contained" color="primary" onClick={() => this.putTagDataToDB(this.state.tag)} className={useStyles.button}>
            Add Tag
                        </Button>
        </form>
      </div>
    );
  }
}