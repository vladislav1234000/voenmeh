import React, { Component } from 'react';
import {
  Panel, PanelHeader, Link, List, Div, Cell, Spinner, FormLayout, Select,
  Group, Switch
} from '@vkontakte/vkui';
import '../css/profile.css';
import connect from '@vkontakte/vk-connect';

import imageVKLogoDark from '../images/vk_logo.png';
import imageVKLogoLight from '../images/logol.png';

import API from '../helpers/apii.js';

const debug = window.location.port === '8080';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.api = new API();
  }

  componentDidMount() {
    if (debug) {
      this.props.setParentState({
        fetchedUser: {
          first_name: 'Test', last_name: 'User', id: 1, photo_100: 'https://sun9-48.userapi.com/c855720/v855720034/160922/eGFyRrMUaY8.jpg?ava=1'
        }
      });
    }
  }

  render() {
    if (!this.props.fetchedUser) {
      return (
        <Panel id="profile">
          <PanelHeader>Профиль</PanelHeader>
          <Div><Spinner size="s" /></Div>
        </Panel>
      );
    }


    const onChange = (e) => {
      const { name, value } = e.currentTarget;

      if (value.trim().length > 0) {
        this.props.setParentState({ [name]: value });
      } else {
        this.props.setParentState({ [name]: false });
      }
      connect.send('VKWebAppStorageSet', { key: name, value });
      if (name === 'group') {
        this.props.setScheduleNEW(value);
      }
      if (name === 'faculty') {
        this.props.getGroups(value);
      }
    };

    const { last_name, first_name, photo_100 } = this.props.fetchedUser;

    const { scheme } = this.props.state;

    return (
      <Panel id="profile">
        <PanelHeader>Профиль</PanelHeader>

        <Div className="name">
          <img alt="" style={{ borderRadius: 50, marginTop: 20 }} src={photo_100} />
        </Div>
        <Div className="name">
          {`${first_name} ${last_name}`}
        </Div>

        <Group id={scheme === 'bright_light' ? 'groupl' : 'groupD'} title="Данные" style={{ borderRadius: '20px 20px 0px 0px', marginTop: 20 }}>
          <FormLayout>
            <Select
              top="Выбери свой факультет"
              placeholder="Не выбран"
              onChange={onChange}
              value={ this.props.state.faculty }
              name="faculty"
            >
              <option value="А">А</option>
              <option value="В">В</option>
              <option value="И">И</option>
              <option value="К">К</option>
              <option value="Н">Н</option>
              <option value="О">О</option>
              <option value="П">П</option>
              <option value="Р">Р</option>
            </Select>

            {
              this.props.state.groupsLoading ?
              <Div style={{ marginTop: 24 }}><Spinner/></Div>
              :
              <Select
                top="Группа"
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
        </Group>

        <Group id={scheme === 'bright_light' ? 'groupl' : 'groupD'} style={{ marginTop: -10 }} title="Уведомления">
          <Cell
            className="cell"
            multiline
            asideContent={(
              <Switch
                checked={this.props.state.noty}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    connect.send('VKWebAppAllowNotifications', {});
                  } else {
                    connect.send('VKWebAppDenyNotifications', {});
                    this.props.setParentState({ noty: false });
                  }
                }}
              />
            )}
          >
              Сервис будет присылать уведомления, например, об отмене занятий
          </Cell>
        </Group>

        <Group id={scheme === 'bright_light' ? 'groupl' : 'groupD'} style={{ marginTop: -10 }} title="Обратная связь">
          <List>
            <Link href="https://vk.com/voenmehgo" target="_blank">
              <Cell
                before={(
                  <img
                    alt=""
                    width="30"
                    height="30"
                    style={{
                      marginRight: 5
                    }}
                    src={this.props.state.scheme === 'space_gray' ? imageVKLogoDark : imageVKLogoLight}
                  />
                )}
                description="@voenmehgo"
              >
                  Сообщество сервиса
              </Cell>
            </Link>

            <Link href="https://vk.com/krethub" target="_blank">
              <Cell
                before={(
                  <img
                    alt=""
                    width="30"
                    height="30"
                    style={{
                      marginRight: 5
                    }}
                    src={this.props.state.scheme === 'space_gray' ? imageVKLogoDark : imageVKLogoLight}
                  />
                  )}
                description="@krethub"
              >
Владислав Кретов
              </Cell>
            </Link>
          </List>
        </Group>
      </Panel>
    );
  }
}

export default Profile;
