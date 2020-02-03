import React, { Component } from 'react';
import { Panel, PanelHeader, List, Div, Separator, Cell } from '@vkontakte/vkui';

import '../css/schedule.css';

import DatePickerComponent from './DatePickerComponent.jsx';

import Icon20LikeOutline from '@vkontakte/icons/dist/20/like_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';

import API from '../helpers/apii.js';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      schedule: this.props.schedule,
      ned: false
    };
    this.pickDate = this.pickDate.bind(this);
    this.api = new API();
  }

  pickDate = async (d) =>  {
    let { odd, even  } = this.state.schedule;

  //  if(odd[0].length === 0) odd = even;

    const weekDay = d.weekday();

    const ned = await this.api.GetWeek();

    this.setState({ ned: ned.week });

    console.table(odd[weekDay])

    if (weekDay === -1) return this.setState({ lessons: [null] });
    if (!odd[weekDay] || !even[weekDay]) return this.setState({ lessons: [null] });
    if ((odd[weekDay].length === 0) || (even[weekDay].length === 0)) return this.setState({ lessons: [null] });


    const les = [];

    if (ned.week === 'even') {
      console.warn('even')
      even[weekDay].map(l => les[l.numb - 1] = l );

    } else {
      console.error('odd')
      odd[weekDay].map((l) => les[l.numb - 1] = l );
    }

    this.setState({ lessons: les });
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

        <div className='test' key={id}>
        {Discipline /*&& id !== 0 */ && <Separator /*style={{ marginTop: 8 }}*/ wide />}
        {
        /*!Discipline && <Div/>*/}
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
              <div className="lesson_content">
                <div className="lesson_name">{Discipline}</div>
                {
                  Classroom ?
                  <div style={{ fontSize: 13 }} className="lesson_aud">
                  {`Аудитория: ${lcFirst(Classroom)}`}
                  </div>
                :
                <div style={{ fontSize: 13 }} className="lesson_aud">
                Аудитория: зависит от распределения
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
          <DatePickerComponent week={this.state.ned} variable={this} />
        </div>
        <div style={{ marginTop: 8 }} className="lessons">
          {lessons}
        </div>
      </Panel>
    );
  }
}

export default Schedule;
