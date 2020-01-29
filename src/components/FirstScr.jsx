
import React, { Component } from 'react';
import {
  Button, Panel, FormLayout, Select
} from '@vkontakte/vkui';
import '../css/first.css';

import API from '../helpers/apii.js';

class FirstScr extends Component {
  constructor(props) {
    super(props);

    this.state = {
        fac: localStorage.getItem('faculty'),
        faculty: false,
        group: false || localStorage.getItem('group'),
        groups: []
      };
      this.api = new API();
    }


  componentDidMount() {
  }


  render() {
      const onChange = (e) => {
         const { name, value } = e.currentTarget;
               console.log(name, value)
         if (value.trim().length > 0) {
           this.setState({ [name]: value });
         } else {
           this.setState({ [name]: false });
         }

           
         if (name === 'group') {
             console.log(this.state.faculty)
            // this.props.setScheduleNEW(value);
             this.props.setSchedule();
             //localStorage.setItem('faculty', this.state.faculty);
            // localStorage.setItem('group', value);
             }
         if(name === 'faculty') {
             getGroups(value);
         }
       }
    
        const getGroups = async (value) => {
            let result = await this.api.GetGroups(value);
            result = [{group: '1'},{group: '2'},{group: '3'},{group: '4'},{group: '5'}]
            let gr = result.map((r) =>  (
                  <option value={r.group} key={r.group}>{r.group}</option>
              ));
            this.setState({
              groups: gr
            })
            console.log(this.state.groups)
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
              value={this.state.faculty}
              name="faculty"
            >
               <option value='А' >А</option>
               <option value='Б' >Б</option>
               <option value='И' >И</option>
               <option value='К' >К</option>
               <option value='Н' >Н</option>
               <option value='О' >О</option>
               <option value='П' >П</option>
               <option value='Р' >Р</option>
            </Select>

            <Select
              top="Выбери свою группу"
              placeholder="Не выбрана"
              onChange={onChange}
              value={this.state.group}
              disabled={!this.state.faculty}
              name="group"
            >
              {this.state.groups}
            </Select>
          </FormLayout>

          <div className="button_next_first">
            <Button
              onClick={() => {
                localStorage.setItem('group', this.state.group);
                localStorage.setItem('faculty', JSON.parse(this.state.faculty).faculty);
                this.props.variable.changePage('schedule');
              }}
              size="l"
              stretched
              className="button_Panel"
              style={{ margin: 0 }}
              disabled={!this.state.group || !this.state.faculty}
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
