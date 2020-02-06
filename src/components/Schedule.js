import React, { Component } from 'react';
import { Panel, PanelHeader, Separator, Cell } from '@vkontakte/vkui';

import '../css/schedule.css';

import DatePickerComponent from './DatePickerComponent.js';

import Icon20LikeOutline from '@vkontakte/icons/dist/20/like_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';


class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: this.props.schedule,
      ned: false
    };
    this.pickDate = this.pickDate.bind(this);
  }

  pickDate = async (d) =>  {
    let { odd, even  } = this.state.schedule;

    const weekDay = d.weekday();

    const ned = this.props.state.week;
    console.log(99, ned)
    this.setState({ ned: ned.week });
    if(!odd || !even) return;

    if (
      weekDay === -1 ||
      !odd[weekDay] ||
      !even[weekDay] ||
      odd[weekDay].length === 0 ||
      even[weekDay].length === 0
    ) {
      return this.props.setParentState({ lessons: [null] });
    }

    const les = [];

      if (ned.week === 'even') {
        console.log('чет')
        even[weekDay].map(l => les[l.numb - 1] = l );
      } else {
        console.log('нечет')
        odd[weekDay].map((l) => les[l.numb - 1] = l );
      }
    this.props.setParentState({ lessons: les });
  }

  render() {
    const lessons = this.props.state.lessons.map((les, id) => {
      if (!les) {
        return (
          <div
            key={id}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <img alt='' src={require('../images/schedule.png')} style={{ width: '20%', marginTop: '30%' }} />
            <span style={{
              marginTop: '40px', fontWeight: '550', color: '#7f8285', width: '80%', textAlign: 'center'
            }}
            >
              Кажется, сегодня пар нет
              <br />
              Можно отдохнуть!
            </span>
          </div>
        );
      }

      const {
        Time, TypeLesson, Discipline, Classroom, Lecturer,/* numb*/
      } = les;
      //const already = false;
      const openModal = () => {
        console.log(12123)
        this.props.openModal({
          form: TypeLesson,
          teacher: Lecturer,
          title: Discipline,
          aud: Classroom,
          time: `${Time[0]} - ${Time[1]}`
        });
      }
      const lcFirst = str => {
        if (!str) return str;
        if (!str.startsWith('П')) return str;
        return str[0].toLowerCase() + str.slice(1);
      }
      return (

        <div className={this.props.state.scheme === 'bright_light' ? 'test' : 'dark'} key={id}>
        { Discipline && <Separator wide /> }

          {
            Discipline ?
            <div onClick={() => openModal()}  className="lesson">
              <div className={this.props.state.scheme === 'bright_light'
              ? 'lesson_time' : 'lesson_timeD' }>
                <div>{Time[0]}</div>
                <div style={{ color: '#ccc' }}>{Time[1]}</div>
              </div>
              {/*
              already ?
                <img src={require('../images/green.png')} style={{ width: '3%', marginBottom: '10%', marginRight: 10   }} />
              :
                <img src={require('../images/red.png')} style={{ width: '3%', marginBottom: '10%', marginRight: 10   }} />
                */}
              <div className="lesson_contentD">
                <div className="lesson_name">{Discipline}</div>
                {
                  Classroom ?
                  <div style={{ fontSize: 13 }} className="lesson_aud">
                  {`Аудитория: ${lcFirst(Classroom)}`}
                  </div>
                :
                <div style={{ fontSize: 13 }} className="lesson_aud">
                Аудитория: не указана
                </div>
              }
              </div>
              <div id='info'><Icon28InfoOutline width={20} height={20}/></div>
            </div>
            :
            <Cell
              className="nolesson"
              before={<Icon20LikeOutline />}
              description="Почему бы не отдохнуть?"
              >
              Окно между парами!
            </Cell>
          }
        </div>
      );
    });
    return (
      <Panel id="schedule">
        <PanelHeader noShadow>Расписание</PanelHeader>
        <div className="lessons_date">
          <DatePickerComponent {...this.props} week={this.props.state.week.week} variable={this} />
        </div>
        <div style={{ marginTop: 8 }} className="lessons">
          {lessons}
        </div>
      </Panel>
    );
  }
}

export default Schedule;
