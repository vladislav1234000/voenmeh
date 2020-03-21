import React from 'react';
import '../css/DatePickerComponent.css';
import '../css/main.css';

import moment from 'moment';

//import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
//import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import { HorizontalScroll, Separator } from '@vkontakte/vkui';

require('moment/locale/ru');

class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDayIndex: 0,
      week: this.props.state.week,
      currentId: 0,
      selectedDay: moment(new Date())
    };
    this.dateSelect = this.dateSelect.bind(this);
    this.generateDates = this.generateDates.bind(this);
    this.firstLetterUP = this.firstLetterUP.bind(this);
  }

  componentDidMount() {
    console.log(1)
    this.setState({
      week: this.props.state.startWeek
    });
    this.props.setParentState({ week: this.props.state.startWeek });
    this.props.pickDate(moment(new Date()));
    const { firstDate, selectedDate } = this.state;
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
    this.props.pickDate(selected);
  }

  firstLetterUP(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  dateSelect(props) {

    let week = this.state.week;
    console.log(props.id, this.state.selectedDayIndex)

    if(props.id >= 7 && this.state.selectedDayIndex <= 6){
      console.log(7777)
      if(week === 'even') {
        week = 'odd';
      } else {
        week = 'even';
      }
      this.setState({
        week: week
      });
      this.props.setParentState({
        week: week
      });

    } else if(props.id < 7 && this.state.selectedDayIndex >= 7 &&
      props.id !== this.state.selectedDayIndex) {
      console.log(99999)
      if(week === 'even') {
        week = 'odd';
      } else {
        week = 'even';
      }
      this.setState({
        week: this.state.week === 'odd' ? 'even' : 'odd'
      });
      this.props.setParentState({
        week: this.state.week
      });
    }


    this.props.pickDate(props.date, week);
    this.setState({
      selectedDayIndex: props.key,
      selectedDay: props.date
    });
    console.log(this.props.state.schedule)
  };

  generateDates(props) {
      var days = [];

      for (var i = 0; i <= 13; i++) {
        let ddday = moment(moment().clone().startOf('isoWeek')).add(i, 'days');
        days.push({
          id: i,
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
        let selectedStyle = selectedDayIndex === key ? "dateTextDark selectedDateTextDark" : "dateTextDark";
        if(this.props.state.scheme === 'bright_light'){
          selectedStyle = selectedDayIndex === key ? "dateTextLight selectedDateText" : "dateTextLight";
        }
        return (
          <div className={"singleContainer"}
            key={key}
            onClick={() => {
              this.dateSelect({
                key,
                date: moment(availableDates[key].date),
                id: val.id
              });
              console.log(availableDates[key].date)
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

    return (
      <div>
      <HorizontalScroll className={this.props.scheme === 'bright_light' ? 'scrollLight' : 'scrollDark'}>
        <div style={{ display: 'flex', padding: '25px 0px', /*justifyContent:'center'*/ }}>
          {days || null}
        </div>
      </HorizontalScroll>
        <Separator wide />
      <div className={'SFProDisplay'} style={{ display: 'flex' }}>
      <div style={{
        fontWeight: 400,
        marginTop: 10,
        marginLeft: 10,
        color: this.props.state.scheme === 'bright_light' ? '#6d7885' : '#76787a',
        fontSize: '14px'
      }}>{this.firstLetterUP(moment(selectedDay).format('dddd, D MMMM'))}</div>
      <div
        style={{
        fontWeight: 400,
        marginTop: 10,
        marginRight: 10,
          color: this.props.state.scheme === 'bright_light' ? '#6d7885' : '#76787a',
        position: 'absolute',
        right: 0,
          display: 'flex',
          alignItems: 'center',
        fontSize: '14px'
      }}>
       {`${this.state.week === 'even' ? 'Чётная' : 'Нечётная'} неделя`}
      </div>
      </div>
    </div>
    );
  }
}

export default DatePickerComponent;
