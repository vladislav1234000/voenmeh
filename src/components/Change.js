import React, { Component } from 'react';
import {
     Panel, PanelHeader, FormLayout, Input, Textarea, Button, PanelHeaderBack
} from '@vkontakte/vkui';

import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';

class Change extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: this.props.task.title,
			desk: this.props.task.desk || '',
			time: this.props.task.time.split('-').slice(3,4).toString(),
			date: this.props.task.time.split('-').slice(0,3).join('-'),
			error: false
		};
	console.log(this.state)
	};

	 onChange = e => {

	 	const { name, value } = e.currentTarget;

	 	this.setState({
			[name]: value
		});
	};

	 send = () => {
	 	const { changeTask, openErrorSnackbar } = this.props;

	 	if(!this.state.title) {
	 		this.setState({ error: true });
	 		setTimeout(() => 	this.setState({ error: false }), 2000)
			openErrorSnackbar('Заполните обязательные поля.');
	 		return;
		} else if (this.state.title.length > 500) {
			this.setState({ error: true });
			setTimeout(() => 	this.setState({ error: false }), 2000)
			openErrorSnackbar('Заголовок слишком длинный.');
			return;
		} else if (this.state.desk.length > 1000) {
			this.setState({ error: true });
			setTimeout(() => 	this.setState({ error: false }), 2000)
			openErrorSnackbar('Описание слишком длинное.');
			return;
		}
		 changeTask({
			 id: this.props.task.id,
			 title: this.state.title,
			 desk: this.state.desk,
			 time: this.state.date ? `${this.state.date}-${this.state.time}` : ''
		 }, this.props.task.id);

		/* this.setState({
			 title: '',
			 desk: '',
			 date: '',
			 time: '00:00'
		 })*/
	 };

	render() {

		const props = this.props;
		const { onChange, send } = this;

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
			> Редактировать</PanelHeader>
			<FormLayout>
				<Input
					onChange={onChange}
					name='title'
					top='Что необходимо сделать? (кратко)'
					placeholder='Покормить кота'
					maxLength='500'
					status={this.state.error &&  (!this.state.title || this.state.title.length > 500)? 'error' : 'default'}
                    value={this.state.title}
				/>
				<Textarea
					onChange={onChange}
					name='desk'
					top='Подробности задачи, если необходимо'
					status={this.state.error && this.state.desk.length > 1000 ? 'error' : 'default'}
					placeholder='Консервы лежат в ящике у холодильника.'
					maxLength='1000'
                    value={this.state.desk}
				/>
				 <div className='FormLayout__row-top'>Укажите срок дедлайна</div>
                          <div style={{
                              display: 'flex',
                              marginTop: -25,
                          }}>
                          <Input
                               onChange={onChange}
                               name='date'
                               type='date'
                               value={this.state.date}
                               min={`${new Date().getFullYear()}-${(new Date().getMonth()) < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate()}`}
                          />
                          <Input
                              onChange={onChange}
                              name='time'
                              type='time'
                              value={this.state.time}
                          />
                          </div>
				<Button
					mode='primary'
					size='xl'
					before={<Icon28DoneOutline/>}
					onClick={() => {
						send()
					}}
				>Сохранить</Button>
			</FormLayout>
			{props.state.snackbar}
		</Panel>
	);
	};
};


export default Change;
