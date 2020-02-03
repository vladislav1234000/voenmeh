
import React, { Component } from 'react';
import { Button, Panel, FormLayout, Select, Div, Spinner } from '@vkontakte/vkui';
import '../css/first.css';

import API from '../helpers/apii.js';
import connect from '@vkontakte/vk-connect';

class FirstScr extends Component {
  constructor(props) {
    super(props);

      this.api = new API();
    }


  componentDidMount() {
  }


  render() {
      const onChange = (e) => {
         const { name, value } = e.currentTarget;
               console.log(name, value)
         if (value.trim().length > 0) {
           this.props.setParentState({ [name]: value });
         } else {
           this.props.setParentState({ [name]: false });
         }

        connect.send("VKWebAppStorageSet", {"key": name, "value": value});

         if (name === 'group') this.props.setScheduleNEW(value);
         if(name === 'faculty') this.props.getGroups(value);

       }

   // const groups = this.state.faculty ? JSON.parse(this.state.faculty).groups.map((group) => (
   //   <option value={JSON.stringify(group)} key={group.name}>{group.name}</option>
  //  )) : <option value={null} />;

    return (
      <Panel id="first">
        <div className="onboarding">
          {/* <img src={require('../images/firstP_dark.png')} className="image_first" /> */}

          <span className="title">Пора знакомиться!</span>
          <span className="subtitle">
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
              <option value="И">И</option>
              <option value="Е">Е</option>
              <option value="О">О</option>
              <option value="Р">Р</option>
            </Select>

            {
              this.props.state.groupsLoading ?
              <Div style={{ marginTop: 24 }}><Spinner/></Div>
              :
              <Select
                top="Выбери свою группу"
                placeholder="Не выбрана"
                onChange={onChange}
                value={ this.props.state.group }
                disabled={!this.props.state.faculty}
                name="group"
              >
                {this.props.state.groups}
              </Select>
            }
          </FormLayout>

          <div className="button_next_first">
            <Button
              onClick={() => {

                  this.props.variable.changePage('schedule');

              }}
              size="l"
              stretched
              className="button_Panel"
              style={{ margin: 0 }}
              disabled={
                !this.props.state.group ||
                !this.props.state.faculty ||
                !this.props.state.schedule.odd
              }
            >
              Поехали!
            </Button>
          </div>
        </div>
      </Panel>
    );
  }
}

export default FirstScr;
