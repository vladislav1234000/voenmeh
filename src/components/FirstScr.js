
import React, { Component } from 'react';
import {
  Button, Panel, FormLayout, Select, Div, Spinner
} from '@vkontakte/vkui';
import '../css/first.css';

import connect from '@vkontakte/vk-connect';

class FirstScr extends Component {


  render() {
    const onChange = (e) => {
      const { name, value } = e.currentTarget;
      if (value.trim().length > 0) {
        this.props.setParentState({ [name]: value });
      } else {
        this.props.setParentState({ [name]: false });
      }

      connect.send('VKWebAppStorageSet', { key: name, value });

      if (name === 'group') {
        this.props.setParentState({
          schedule: []
        });
        this.props.setSchedule(value);
      }
      if (name === 'faculty') this.props.getGroups(value, false);
    };

    const scheme = this.props.state.scheme;

    return (
      <Panel id="first">
        <div className="onboarding">
          {/* <img src={require('../images/firstP_dark.png')} className="image_first" /> */}
          <span className={scheme === 'bright_light' ? 'title' : 'titleD'}>Пора знакомиться!</span>
          <span className={scheme === 'bright_light' ? 'subtitle' : 'subtitleD'}>
          Чтобы продолжить работу с сервисом,
              <br />
            необходимо выбрать свой факультет и группу.
              <br />
            Благодаря этим данным мы сможем фильтровать
              <br />
            ленту новостей и показать твоё расписание.
          </span>

          <FormLayout className="select_group">
            <Select
              top="Выбери свой факультет"
              placeholder="Не выбран"
              onChange={onChange}
              value={this.props.state.faculty}
              name="faculty"
            >
              <option value="А">А</option>
              <option value="Е">Е</option>
              <option value="И">И</option>
              <option value="О">О</option>
              <option value="Р">Р</option>
              <option value="В">ВУЦ</option>
            </Select>

            {
              this.props.state.groupsLoading
                ? <Div style={{ marginTop: 24 }}><Spinner /></Div>
                : (
                  <Select
                    top="Выбери свою группу"
                    placeholder="Не выбрана"
                    onChange={onChange}
                    value={this.props.state.group}
                    disabled={!this.props.state.faculty}
                    name="group"
                  >
                    {this.props.state.groups}
                  </Select>
                )
}
          </FormLayout>

          <div className="button_next_first">
            <Button
              onClick={() => {
                this.props.setParentState({
                  activePage: 'schedule'
                });
              }}
              size="l"
              stretched
              className="button_Panel"
              style={{ margin: 0 }}
              disabled={
                !this.props.state.group
                || !this.props.state.faculty
                || !this.props.state.schedule.odd
              }
            >
              {
                !this.props.state.schedule.odd && this.props.state.group ?
                  <Spinner
                     style={{ color: '#ccc'}}
                     size='small'
                    />
                    : 'Поехали!'
              }
            </Button>
          </div>
        </div>
        {this.props.state.snackbar}
      </Panel>
    );
  }
}

export default FirstScr;
