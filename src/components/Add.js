import React, { Component } from 'react';
import {
  PanelHeaderBack, Panel, PanelHeader, FormLayout, Input, Textarea, Button
} from '@vkontakte/vkui';

import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';

// `${new Date().getFullYear()}-${(new Date().getMonth()) < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate()}`

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
        error: false
    };

  };

  onChange = e => {

    const { name, value } = e.currentTarget;

    this.props.setParentState({
      [name]: value
    });
  };

  send = () => {
    const { addTask, openErrorSnackbar, state } = this.props;

    if(!state.title) {
      this.setState({ error: true });
      setTimeout(() => 	this.setState({ error: false }), 2000)
      openErrorSnackbar('Заполните обязательные поля.');
      return;
    } else if (state.title.length > 500) {
      this.setState({ error: true });
      setTimeout(() => 	this.setState({ error: false }), 2000)
      openErrorSnackbar('Заголовок слишком длинный.');
      return;
    } else if (state.desk.length > 1000) {
      this.setState({ error: true });
      setTimeout(() => 	this.setState({ error: false }), 2000)
      openErrorSnackbar('Описание слишком длинное.');
      return;
    }/* else if (Date(new Date(this.state.date)).parse() < Date(new Date()).parse) {
			this.setState({ error: true });
			setTimeout(() => 	this.setState({ error: false }), 2000)
			openErrorSnackbar('Дата дедлайна не может быть в прошлом.');
			return;
		}*/

    addTask();
  };

  render() {

    const props = this.props;
    const { onChange, send } = this;
    const state = props.state;

    return (
      <Panel id={props.id}>
        <PanelHeader
          left={
            <PanelHeaderBack
              onClick={() => props.setParentState({
                deadPanel: 'main'
              })}
            />
          }
        > Добавить</PanelHeader>
        <FormLayout>
          <Input
            onChange={onChange}
            name='title'
            top='Что необходимо сделать? (кратко)'
            placeholder='Закрыть двойку по астрономии'
            maxLength='500'
            status={this.state.error &&  (!state.title || state.title.length > 500)? 'error' : 'default'}
            value={state.title}
          />
          <Textarea
            onChange={onChange}
            name='desk'
            top='Описание дедлайна, если необходимо'
            status={this.state.error && state.desk.length > 1000 ? 'error' : 'default'}
            placeholder='Сдать презентацию по небесным телам'
            maxLength='1000'
            value={state.desk}
          />
          {/*<div className='FormLayout__row-top'>Укажите срок дедлайна</div>
          <div style={{
            display: 'flex',
            marginTop: -25,
          }}>*/}
          <Input
            onChange={onChange}
            name='date'
            type='date'
            value={state.date}
            min={`${new Date().getFullYear()}-${(new Date().getMonth()) < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate()}`}
            top='Укажите крайний срок выполнения'
          />
          <Input
            onChange={onChange}
            name='time'
            type='time'
            top='Укажите время к полю выше'
            value={state.time}
          />
          {/*  </div>*/}
          <Button
            mode='primary'
            size='xl'
            before={<Icon28DoneOutline/>}
            onClick={() => {
              send()
            }}
          >Создать дедлайн</Button>
        </FormLayout>
        {state.snackbar}
      </Panel>
    );
  };
}


export default Add;
