import React, { Component } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Div } from '@vkontakte/vkui';
import '../css/page.css';

class Page extends Component {

  render() {
    const { /* id, date, time, tags, */title, content } = this.props.data;
    return (
      <Panel id='page'>
        <PanelHeader left={<PanelHeaderBack onClick={() => this.props.variable.goBack()} />}>Новости</PanelHeader>
        <Div className="page">
          <div className="page_title">{title}</div>
          <div className="page_content">{content}</div>
        </Div>
      </Panel>
    );
  }
}

export default Page;
