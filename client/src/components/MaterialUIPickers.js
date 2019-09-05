import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());


  function handleStartDateChange(date) {
    setSelectedStartDate(date);
    props.parentStartDateCallback(date);
  }

  function handleEndDateChange(date) {
    setSelectedEndDate(date);
    props.parentEndDateCallback(date);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardTimePicker
          margin="normal"
          id="start-time"
          label="Start Time"
          value={selectedStartDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'start time',
          }}
        />

        <KeyboardTimePicker
          margin="normal"
          id="end-time"
          label="End Time"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'end time',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}