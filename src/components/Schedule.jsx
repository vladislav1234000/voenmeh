import React, { Component } from 'react';
import { View, Panel, PanelHeader, FormLayout } from '@vkontakte/vkui';
import '../css/schedule.css';

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lessons: [
        {
          time: ['9:00', '10:30'],
          type: 'Практика',
          name: 'Культурология',
          room: '422* (новый корпус)',
          teacher: 'Клюев Александр Александрович'
        },
        {
          time: ['10:50', '12:25'],
          type: 'Практика',
          name: 'Информатика: основы программирования',
          room: '218*/216* (новый корпус)',
          teacher: 'Гаврютина А. А. и Лазарева Т. И.'
        }
      ]
    };
  }

  render() {
    const lessons = this.state.lessons.map(({ time, type, name, room, teacher }) => (
      <div className="lesson" key={time + name + room}>
        <div className="lesson_time">
          <div>{time[0]}</div>
          <div>{time[1]}</div>
        </div>
        <div className="lesson_border"></div>
        <div className="lesson_content">
          <div className="lesson_type">{type.toUpperCase()}</div>
          <div className="lesson_name">{name}</div>
          <div className="lesson_room">Аудитория: {room}</div>
          <div className="lesson_teacher">Преподаватель: {teacher}</div>
        </div>
      </div>
    ));

    return (
      <Panel id="schedule">
        <PanelHeader>Расписание</PanelHeader>
        <FormLayout>
          <div className="lessons_date">
            Вторник, 17 сентября
          </div>
          <div className="lessons">
            {lessons}
          </div>
        </FormLayout>
      </Panel>
    );
  }
}

export default Schedule;