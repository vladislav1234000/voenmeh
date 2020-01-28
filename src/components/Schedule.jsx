import React, { Component } from 'react';
import { Panel, PanelHeader, Separator, Cell } from '@vkontakte/vkui';

import '../css/schedule.css';

import DatePickerComponent from './DatePickerComponent.jsx';

import Icon20LikeOutline from '@vkontakte/icons/dist/20/like_outline';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      schedule: this.props.schedule
    };
    this.pickDate = this.pickDate.bind(this);
  }

  pickDate = (d) =>  {
    const { odd, even } = this.state.schedule;

    const weekDay = d.weekday();
    const k = d.week() / 2;

    if (weekDay === -1) return this.setState({ lessons: [null] });
    if (!odd[weekDay] || !even[weekDay]) return this.setState({ lessons: [null] });
    if ((odd[weekDay].length === 0) || (even[weekDay].length === 0)) return this.setState({ lessons: [null] });

    const les = [];
    if (k !== Math.floor(k)) {
      console.log('чётная', weekDay, k);

      even[weekDay].map((l) => {
        les[l.numb - 1] = l;
        return true // убрать, если что-то пошло по *****
      });

      this.setState({ lessons: les });
    } else {
      console.log('нечётная', weekDay, k);

      odd[weekDay].map((l) => {
        les[l.numb - 1] = l;
        return true// убрать, если что-то пошло по *****
      });

      this.setState({ lessons: les });
    }

  //  return false;
  }

  render() {
    const lessons = this.state.lessons.map((les, id) => {
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
            <img alt='' src={require('../images/schedule.png')} style={{ width: '40%', marginTop: '30%' }} />
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
          teacher: Lecturer.FullName ? Lecturer.FullName : Lecturer.ShortName,
          title: Discipline,
          aud: Classroom,
          time: `${Time[0]} - ${Time[1]}`
        });
      }
      return (
        <div key={id}>
          <Separator style={{ marginTop: 8 }} wide />
          {
            Discipline ?
            <div onClick={() => openModal()}  className="lesson">
              <div className="lesson_time">
                <div>{Time[0]}</div>
                <div style={{ color: '#ccc' }}>{Time[1]}</div>
              </div>
            {/*
              already ?
                <img src={require('../images/green.png')} style={{ width: '3%', marginBottom: '10%', marginRight: 10   }} />
              :
                <img src={require('../images/red.png')} style={{ width: '3%', marginBottom: '10%', marginRight: 10   }} />
            */}
              <div className="lesson_border" />
              <div className="lesson_content">
                <div className="lesson_name">{Discipline}</div>
                {
                  Lecturer.ShortName && Classroom ? (
                  <div style={{ fontSize: 13 }} className="lesson_teacher">
                    {Lecturer.FullName ? Lecturer.FullName : Lecturer.ShortName}
                    {`, аудитория ${Classroom}`}
                  </div>
                )
                : false
              }
              </div>
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
          <DatePickerComponent variable={this} />
        </div>
        <div className="lessons">
          {lessons}
        </div>
      </Panel>
    );
  }
}

export default Schedule;
