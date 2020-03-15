import React, { Component } from 'react';
import {
  Panel, PanelHeader, List, Div, Cell, Spinner, FormLayout, Select,
  Group, Switch, Avatar, Header, Separator
} from '@vkontakte/vkui';
import '../css/profile.css';
import connect from '@vkontakte/vk-connect';

import Icon28ChatsOutline from '@vkontakte/icons/dist/28/chats_outline';
import Icon28LogoVkOutline from '@vkontakte/icons/dist/28/logo_vk_outline';
import Icon28LogoInstagram from '@vkontakte/icons/dist/28/logo_instagram';

const debug = window.location.port === '8080';

class Profile extends Component {

  componentDidMount() {
    if (debug) {
      this.props.setParentState({
        fetchedUser: {
          first_name: 'Владислав', last_name: 'Кретов', id: 1, photo_100: 'https://sun9-48.userapi.com/c855720/v855720034/160922/eGFyRrMUaY8.jpg?ava=1'
        }
      });
    }
  }

  render() {
    if (!this.props.fetchedUser.first_name) {
      return (
        <Panel id="profile">
          <PanelHeader>Профиль</PanelHeader>
          <Div><Spinner size="small" /></Div>
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

      // посмотреть кейс, когда изменяется фак, но не изменяется группа
      if (name === 'group') {
        this.props.setScheduleNEW(value, false);
      }
      if (name === 'faculty') {
        this.props.getGroups(value, false);
      }
    };

    const { last_name, first_name, photo_100 } = this.props.fetchedUser;

    const { scheme, headman } = this.props.state;

    return (
      <Panel id="profile">
        <PanelHeader>Профиль</PanelHeader>
        <Group>
          <Div style={{ padding: '15px', display: 'flex' }} >
          <Avatar size={80} src={photo_100} />
            <div className='name'> {`${first_name} ${last_name}`}</div>
            <div className='headman'>{ headman ? 'староста' : 'студент' }</div>
          </Div>
        </Group>
       <Group
         /* id={scheme === 'bright_light' ? 'groupl' : 'groupD'}*/
         header={<Header>Данные студента</Header>}
       >
         <FormLayout>
           <Select
             top="Факультет"
             placeholder="Не выбран"
             onChange={onChange}
             value={ this.props.state.faculty }
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
             this.props.state.groupsLoading ?
               <Div style={{ marginTop: '10%' }}><Spinner/></Div>
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

        <Group
          id={scheme === 'bright_light' ? 'groupl' : 'groupD'}
          header={<Header>Уведомления</Header>}
        >
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

             Сервис сможет присылать тебе уведомления. Например, об отмене занятий
          </Cell>
        </Group>

        <Group
          id={scheme === 'bright_light' ? 'groupl' : 'groupD'}
          header={<Header>Обратная связь</Header>}
        >
      <List>
            <Cell
              href="https://vk.me/join/AJQ1dyvbCxZfidHoAmAJE5Bh"
              target="_blank"
              before={<Icon28ChatsOutline fill='#ccc' />}
            >Присоединиться к чату</Cell>
            <Separator/>
            <Cell
              href="https://vk.com/club187168548"
              target="_blank"
              before={<Icon28LogoVkOutline fill='#ccc' />}
            >Мы ВКонтакте</Cell>
            <Separator/>
            <Cell
              href="https://www.instagram.com/voenmehgo/"
              target="_blank"
              before={<Icon28LogoInstagram fill='#ccc' />}
            >Мы в Instargam</Cell>
            <Separator/>
      </List>
        </Group>
      </Panel>
    );
  }
}

export default Profile;
