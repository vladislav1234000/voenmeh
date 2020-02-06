import React from 'react';
import '../css/DatePickerComponent.css';
import '../css/main.css';

import moment from 'moment';

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
    const selectedDayIndex = getSelectedDay();

  function getSelectedDay() {
      let cur = moment(new Date()).format('dd');
      switch (cur) {
        case 'пн': cur = 0; break;
        case 'вт': cur = 1; break;
        case 'ср': cur = 2; break;
        case 'чт': cur = 3; break;
        case 'пт': cur = 4; break;
        case 'сб': cur = 5; break;
        case 'вс': cur = 6; break;
        default: break;
      }
      return cur
    }

    this.setState({ selectedDayIndex });
    variable.pickDate(selected);
  }

  firstLetterUP(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  dateSelect(props) {
  console.log(this.props)
    this.setState({
        selectedDayIndex: props.key,
        selectedDay: props.date
      });
    this.props.variable.pickDate(props.date);

    if (typeof this.props.onDateSelect === 'function')
    this.props.onDateSelect(props.date);
  };

  generateDates(props) {
      var days = [];

      for (var i = 0; i <= 5; i++) {
        let ddday = moment(moment().clone().startOf('isoWeek')).add(i, 'days');
        days.push({
          date: ddday.format('YYYY-MM-DD'),
          day: ddday.format('D'),
          day_of_week: ddday.format('dd'),
        });
      }
    return days;
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
      <div className={this.props.variable.props.scheme === 'bright_light' ? 'scrollLight' : 'scrollDark'}>
        <div style={{ display: 'flex', padding: '25px 0px', justifyContent:'center' }}>
          {days || null}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
      <div style={{
        fontWeight: 400,
        marginTop: 10,
        marginLeft: 10,
        fontSize: '14px'
      }}>{this.firstLetterUP(moment(selectedDay).format('dddd, D MMMM'))}</div>
      <div
        onClick={() => {
/*
          this.props.setParentState({
            week: this.props.state.week === 'odd' ? 'even' : 'odd'
          });
          let key = this.state.key
          this.dateSelect({
            key, date: moment(availableDates[key].date)
          });
*/
        }}
        style={{
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
