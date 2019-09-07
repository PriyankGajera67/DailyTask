import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Container from '@material-ui/core/Container';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

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
        padding: '0 30px',
    },
    paper: {
        padding: '30px 30px',
        margin: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: theme.spacing(1, 0),
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

export default class User extends React.Component {
    state = {
        data: [],
        id: 0,
        firstName: null,
        lastName: null,
        emailAddress: null,
        phoneNumber: null,
        password:"Doit",
        nationality: null,
        dob: null,
        objectToUpdate: null,
        gender: "female",
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

                <Container fixed>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <h2> Users</h2>
                            {/* <Paper className={useStyles.paper}> */}
                            {data.length <= 0

                                ? 'NO!! Users '

                                : data.map((dat) => (
                                    <div className="tag-chips" style={{ margin: 2 }}>
                                        <Chip key={dat.tag}
                                            label={dat.tag}
                                            color="primary"
                                            className={useStyles.chip}
                                        />
                                    </div>


                                ))}
                            {/* </Paper> */}

                        </Grid>

                        <Grid item xs={6}>
                            <h2>Add New User</h2>
                            <form className={useStyles.root} noValidate>
                                <ValidationTextField
                                    className={useStyles.margin}
                                    label="First Name"
                                    required
                                    variant="outlined"
                                    defaultValue=""
                                    id="validation-outlined-input"
                                    onChange={(e) => this.setState({ tag: e.target.value })}
                                />
                                &nbsp;&nbsp;
                                <ValidationTextField
                                    className={useStyles.margin}
                                    label="Last Name"
                                    required
                                    variant="outlined"
                                    defaultValue=""
                                    id="validation-outlined-input"
                                    onChange={(e) => this.setState({ tag: e.target.value })}
                                />
                                <br></br>
                                <br></br>
                                <FormControl component="fieldset" className={useStyles.formControl}>
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup
                                        aria-label="gender"
                                        name="gender1"
                                        className={useStyles.group}
                                        value={this.state.gender}
                                        onChange={(e) => this.setState({ gender: e.target.value })}
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                                <br></br>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="dob"
                                            label="Date of Birth"
                                            value={this.state.dob}
                                            onChange={(e) => this.setState({ dob: e })}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                                <br></br>
                                <ValidationTextField
                                    className={useStyles.margin}
                                    label="Email"
                                    required
                                    type="email"
                                    variant="outlined"
                                    defaultValue=""
                                    fullWidth
                                    id="validation-outlined-input"
                                    onChange={(e) => this.setState({ emailAddress: e.target.value })}
                                />
                                <br></br>
                                <br></br>
                                <ValidationTextField
                                    className={useStyles.margin}
                                    label="Phone Number"
                                    required
                                    type="number"
                                    variant="outlined"
                                    defaultValue=""
                                    fullWidth
                                    id="validation-outlined-input"
                                    onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                                />
                                <br></br>
                                <br></br>
                                <ValidationTextField
                                    className={useStyles.margin}
                                    label="Password"
                                    required
                                    type="password"
                                    variant="outlined"
                                    defaultValue={this.state.password}
                                    fullWidth
                                    id="validation-outlined-input"
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                />

                                <br />
                                <br />
                                <Button variant="contained" color="primary" onClick={() => this.putTagDataToDB(this.state.tag)} className={useStyles.button}>
                                    Create User
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