import React, { Component } from 'react';
import {
  Panel, PanelHeader, FormLayout, Button, PanelHeaderBack, Input, Textarea
} from '@vkontakte/vkui';

//import connect from '@vkontakte/vk-connect';

class AdminAddNews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      autor: '',
      name: '',
      description: '',
      date: '',
      time: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {

  }

  onChange(e) {
    const { name, value } = e.currentTarget;

    this.setState({ [name]: value });
  }

  render() {

    return (
      <Panel id="news">
        <PanelHeader left={<PanelHeaderBack onClick={() => this.props.setParentState({
          adminPagePanel: 'admin'
        })} />}>Добавление новостей</PanelHeader>
                <FormLayout>

                    <Input
                        type='text'
                        top='Заголовок'
                        name='name'
                        maxLength='60'
                        value={ this.state.name }
                        placeholder={'Заголовок'}
                        onChange={ this.onChange }
                    />
                    <Textarea
                        top='Текст'
                        maxLength='254'
                        name="description"
                        placeholder="Требуем понизить цену на сырки"
                        value={ this.state.description }
                        onChange={ this.onChange }
                    />
                    <Input
                        type='text'
                        top='Автор'
                        name='autor'
                        maxLength='60'
                        value={ this.state.autor }
                        placeholder={'Tefeed'}
                        onChange={ this.onChange }
                    />
                    <Input
                        type='date'
                        top='Дата'
                        name='date'
                        value={this.state.date}
                        onChange={ this.onChange }
                    />
                    <Input
                        type='time'
                        name='time'
                        value={this.state.time}
                        onChange={ this.onChange }
                    />
                    <Button size="xl" level="primary">Отправить</Button>
                    </FormLayout>
      </Panel>
    );
  }
}

export default AdminAddNews;
