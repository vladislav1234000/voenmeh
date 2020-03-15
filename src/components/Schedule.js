import React, { Component } from 'react';
import { Panel, PanelHeader, Separator, Cell } from '@vkontakte/vkui';

import '../css/schedule.css';

import DatePickerComponent from './DatePickerComponent.js';

import Icon20LikeOutline from '@vkontakte/icons/dist/20/like_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';

import { FaCircle } from 'react-icons/fa';
import moment from 'moment';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: this.props.schedule,
      lessons: [null],
      ned: false
    };
    this.pickDate = this.pickDate.bind(this);
  }
  componentDidMount() {
    this.pickDate(moment(new Date()));
      this.props.setParentState({
        week: this.props.state.startWeek
      })
  }

  pickDate = async (d, ned = this.props.state.week) =>  {
    let { odd, even  } = this.state.schedule;

    const weekDay = d.weekday();

    this.setState({ ned: ned });
    if(!odd || !even) return;
    if (
      weekDay === -1 ||
      (ned === 'odd' && (!odd[weekDay] || odd[weekDay].length === 0)) ||
      (ned === 'even' && (!even[weekDay] || even[weekDay].length === 0))

    ) return this.props.setParentState({ lessons: [null] });

    const les = [];

      if (ned === 'even') {
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
          <>
            <Separator/>
          <div
            key={id}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <img alt='' src={'https://vk.com/images/blog/about/img_about_4.png'} style={{ width: '90%', marginTop: '10vh' }} />
            <span style={{
              marginTop: '40px',
              fontWeight: 'bold',
              color: '#191919',
              width: '80%',
              textAlign: 'center',
              fontSize: '5vw'
            }}
            >
             В этот день занятий нет  <br/>
            Отдыхаем! :)
            </span>
          </div>
            </>
        );
      }

      const {
        Time, TypeLesson, Discipline, Classroom, Lecturer,/* numb*/
      } = les;
      //const already = false;
      const openModal = () => {
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
        {Discipline && <Separator wide /> }

          {
            Discipline ?
            <div onClick={() => openModal()}  className="lesson">
              <div className={this.props.state.scheme === 'bright_light'
              ? 'lesson_time' : 'lesson_timeD' }>
                <div style={{
                  color: this.props.state.scheme === 'bright_light' ? '#000' : '#fff'
                }}>{Time[0]}</div>
                <div style={{ color: '#ccc' }}>{Time[1]}</div>
              </div>
              <FaCircle id={TypeLesson} className='FaCircle' />
              <div className={this.props.state.scheme === 'bright_light'
                ? 'lesson_content' : 'lesson_contentD' }>
                <div className={
                  this.props.state.scheme === 'bright_light'
                    ? 'lesson_name' : 'lesson_nameD'
                } >{Discipline}</div>
                {
                  Classroom ?
                  <div style={{ fontSize: 13 }} className={
                    this.props.state.scheme === 'bright_light'
                      ? 'lesson_aud' : 'lesson_audD'
                  } >
                      {`Аудитория: ${lcFirst(Classroom)}`}
                  </div>
                :
                <div style={{ fontSize: 13 }}  className={
                  this.props.state.scheme === 'bright_light'
                    ? 'lesson_aud' : 'lesson_audD'
                }>
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
          <DatePickerComponent {...this.props} week={this.props.state.week} pickDate={this.pickDate} />
        </div>

        <div style={{ marginTop: 8 }} className="lessons">
          {lessons}
        </div>
        {this.props.state.snackbar}
      </Panel>
    );
  }
}

export default Schedule;
