import React, { Component } from 'react';
import {
  Panel, PanelHeader, PanelHeaderBack
} from '@vkontakte/vkui';

//import connect from '@vkontakte/vk-connect';

class AdminSendNoty extends Component {
  constructor(props) {
    super(props);

    this.state = {

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
      <Panel id='noty'>
      <PanelHeader
          left={<PanelHeaderBack onClick={() => {
            this.props.setParentState({
                    adminPagePanel: 'admin'
                  })
          }} />}>Отправить уведомление</PanelHeader>

      </Panel>
    );
  }
}

export default AdminSendNoty;
