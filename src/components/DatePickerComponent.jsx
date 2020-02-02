import React from 'react';
import '../css/DatePickerComponent.css';
import '../css/main.css';

import moment from 'moment';
import { HorizontalScroll } from '@vkontakte/vkui';

require('moment/locale/ru');

class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDayIndex: 0,
      selectedDay: moment(new Date())
    };
    this.dateSelect = this.dateSelect.bind(this);
    this.generateDates = this.generateDates.bind(this);
    this.firstLetterUP = this.firstLetterUP.bind(this);
  }

  componentDidMount() {
    const { firstDate, selectedDate } = this.state;
    const { variable } = this.props;
    const first = firstDate ? moment(firstDate) : moment(new Date());
    const selected = selectedDate ? moment(selectedDate) : first;
    const selectedDayIndex = moment.duration(selected.diff(first)).asDays();

    this.setState({ selectedDayIndex, });

    variable.pickDate(selected);
    console.log('selected', selected)
  }

  firstLetterUP(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  dateSelect(props) {
    const { onDateSelect } = this.props;
    this.setState(
      {
        selectedDayIndex: props.key,
        selectedDay: props.date
      }
    );
    this.props.variable.pickDate(props.date);

    if (typeof onDateSelect === 'function') {
      onDateSelect(props.date);
    }
  };

  generateDates(props) {
    const date = moment(props.firstDate);
    const disabledDates = props.disabledDates ? props.disabledDates : [];

  /*  const first = props.firstDate
      ? moment(props.firstDate)
      : moment(new Date());
    const last = props.lastDate ? moment(props.lastDate) : null;*/

  /*  const numberOfDays = last
      ? moment.duration(last.diff(first)).asDays() + 1
      : props.numberOfDays;
*/
    const dates = [];
    for (let i = 0; i < 7; i++ ) {
      const isDisabled = !!disabledDates.includes(date.format('YYYY-MM-DD'));

      dates.push({
        date: date.format('YYYY-MM-DD'),
        day: date.format('D'),
        day_of_week: date.format('dd'),
        month: date.format('DD MMMM').split(' ')[1],
        disabled: isDisabled,
      });
      date.add(1, 'days');
    }
    return dates;
  };

  render() {
    let days;
    const {
      firstDate,
      lastDate,
      numberOfDays,
      selectedDay,
      selectedDayIndex
    } = this.state;


    const daysProps = {
      firstDate,
      lastDate,
      numberOfDays: numberOfDays || 31
    };

    const availableDates = this.generateDates(daysProps);

    if (availableDates) {
      days = availableDates.map((val, key) => {
        let selectedStyle = selectedDayIndex === key ? "dateTextDark selectedDateText" : "dateTextDark";
        if(this.props.variable.props.scheme === 'bright_light'){
          selectedStyle = selectedDayIndex === key ? "dateTextLight selectedDateText" : "dateTextLight";
        }
        return (
          <div className={"singleContainer"}
            key={key}
            disabled={val.disabled}
            onClick={() => {
              this.dateSelect({
                key, date: moment(availableDates[key].date)
              });
            }}>
            <div className={'day' + selectedStyle}>{val.day}</div>

              <div className={"dayContainer"}>
                <div className={'weekDay' + selectedStyle}>
                  {val.day_of_week}
                </div>
            </div>
          </div>
        );
      });
    }

    //  let k = moment(selectedDay).week() / 2;

    return (<div>
      <HorizontalScroll className={this.props.variable.props.scheme === 'bright_light' ? 'scrollLight' : 'scrollDark'}>
        <div style={{ display: 'flex', padding: '25px 0px'  }}>
          {days || null}
        </div>
      </HorizontalScroll>
      <div style={{ display: 'flex' }}>
      <div style={{
        fontWeight: 400,
        marginTop: 10,
        marginLeft: 10,
        fontSize: '14px'
      }}>{this.firstLetterUP(moment(selectedDay).format('dddd, D MMMM'))}</div>
      <div style={{
        fontWeight: 400,
        marginTop: 10,
        marginRight: 10,
      /*  marginBottom: 10,*/
        position: 'absolute',
        right: 0,
        fontSize: '14px'
      }}>{`${this.props.week === 'even' ? 'Чётная' : 'Нечётная'} неделя`}</div>
      </div>
    </div>
    );
  }
}

export default DatePickerComponent;
