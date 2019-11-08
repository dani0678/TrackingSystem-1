import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';
import 'date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const send = () => {
    const term = {
      start: startDate.getTime(),
      end: endDate.getTime()
    };
    props.onSend(term);
  };

  useEffect(send, [endDate]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
      <Grid container justify="space-around">
        <DateTimePicker
          variant="inline"
          label="開始時間"
          format="yyyy/MM/dd h:mm"
          value={startDate}
          onChange={date => {
            setStartDate(date);
            setEndDate(date);
          }}
        />
      </Grid>
      <br />
      <Grid container justify="space-around">
        <DateTimePicker
          variant="inline"
          label="終了時間"
          format="yyyy/MM/dd h:mm"
          value={endDate}
          onChange={date => setEndDate(date)}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
