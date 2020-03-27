import React, { Component } from 'react';
import connect from '@vkontakte/vk-bridge';
import {
  Epic, Tabbar, TabbarItem, Snackbar, Div, ConfigProvider, View, IS_PLATFORM_ANDROID, Spinner, Header,
  ScreenSpinner, Alert, Panel,
  ModalRoot, ModalPage, PanelHeaderButton, Avatar, ModalPageHeader, Group, List, Cell, InfoRow, Button
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './css/main.css';
import './css/first.css';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon24Write from '@vkontakte/icons/dist/24/write';

import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon20CalendarOutline from '@vkontakte/icons/dist/20/calendar_outline';
import Icon28ArchiveOutline from '@vkontakte/icons/dist/28/archive_outline';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';

import Schedule from './components/Schedule.js';

import Archive from './components/Archive.js';
import Office from './components/Office.js';

import Profile from './components/Profile.js';

import FirstScr from './components/FirstScr.js';
import NewsFeed from './components/NewsFeed.js';

import Deadlines from './components/Deadlines.js';
import Add from './components/Add.js';
import Change from './components/Change.js';

import API from './helpers/API.js';

import Onboarding from './components/onboardingPanels/Onboarding.js';

import dark1 from './components/onboardingPanels/dark1.png';
import dark2 from './components/onboardingPanels/dark2.png';
//import dark3 from './components/onboardingPanels/dark3.png';
import dark4 from './components/onboardingPanels/dark4.png';
//import dark5 from './components/onboardingPanels/dark5.png';
import dark6 from './components/onboardingPanels/dark6.png';
import dark7 from './components/onboardingPanels/dark7.png';


import light1 from './components/onboardingPanels/light1.png';
import light2 from './components/onboardingPanels/light2.png';
//import light3 from './components/onboardingPanels/light3.png';
import light4 from './components/onboardingPanels/light4.png';
//import light5 from './components/onboardingPanels/light5.png';
import light6 from './components/onboardingPanels/light6.png';
import light7 from './components/onboardingPanels/light7.png';
import moment from 'moment';


const admins = [462723039, 198082755, 87478742, 236820864, 1];
const qs = require('querystring');
var params = window.location.search.replace('?', '').replace('%2C', ',');

const urlParams = qs.parse(params);
const ordered = {
  vk_are_notifications_enabled: 0,
};
Object.keys(urlParams).sort().forEach((key) => {
    if (key.slice(0, 3) === 'vk_') {
        ordered[key] = urlParams[key];
    }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 'load', // first !!
      activePanel: 'archive',
      deadPanel: 'main',
      history: ['feed'],
      fetchedUser: {
        id: 1
      },
      curTask: [],
      deadtab: 'active',
      office: [],
      isOfficeOpened: false,
      group: false,
      news: [],
      banners: [],
      schedule: {},
      deadlines: [
        {
          id: 1,
          title: 'Test Title',
          desk: 'Description',
          time: '2020-04-02-00:00'
        },
        {
          id: 2,
          title: 'Test Title',
          desk: 'Description',
          time: '2030-02-02-00:00'
        },
        {
          id: 1,
          title: 'Test Title',
          desk: 'Description',
          time: '2020-04-02-00:00'
        },
        {
          id: 2,
          title: 'Test Title',
          desk: 'Description',
          time: '2030-02-02-00:00'
        },
        {
          id: 1,
          title: 'Test Title',
          desk: 'Description',
          time: '2020-04-02-00:00'
        },
        {
          id: 2,
          title: 'Test Title',
          desk: 'Description',
          time: '2030-02-02-00:00'
        },
        {
          id: 1,
          title: 'Test Title',
          desk: 'Description',
          time: '2020-04-02-00:00'
        },
        {
          id: 2,
          title: 'Test Title',
          desk: 'Description',
          time: '2030-02-02-00:00'
        },
      ],
      expDeadlines: [],
      groups: [],
      scheme: true ? 'space_gray' : 'bright_light',
      modal: null,
      lessons: [null],
      noty: false,
      week: false,
      startWeek: false,
      offices: false,
      groupsLoading: false,
      snackbar: null,
      selectedDayIndex: 0,
      selectedDay: moment(new Date()),
      headman: false,
      modalData: null,
      title: '',
      desk: '',
      time: '00:00',
      date: `${new Date().getFullYear()}-${(new Date().getMonth()) < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate()}`
    };
    this.api = new API();
  }


  componentDidMount() {
    /*window.addEventListener('popstate', e => {
      console.log('нажатие на кнопку назад')
    });
    window.onpopstate = function(e) {
      console.log('жопа')
      e.preventDefault();
      alert('нажал')
      console.log('нажатие на кнопку назад')
      //   this.goBack();
    };*/
    const getWeek = async () => {
      let w = await this.api.GetWeek();
      this.setState({
        week: w,
        startWeek: w
      });
      if(!w) this.errorHappend();
    };
    getWeek();

    this.setState({ noty: ordered.vk_are_notifications_enabled === 1 ? true : false });

    if (window.location.port === '8080') this.setState({ activePage: 'time' });

    connect.subscribe((e) => {
      switch (e.detail.type) {

        case 'VKWebAppGetUserInfoResult':
          this.setState({ fetchedUser: e.detail.data });
          const qwe = async () => {
            let res = await this.api.GetStatus(e.detail.data.id);
            this.setState({ headman: res });
          };
          qwe();
          break;

        case 'VKWebAppUpdateConfig':
          const schemeAttribute = document.createAttribute('scheme');
          let schemeK = e.detail.data.scheme;

          switch (schemeK) {
            case 'client_light':
              schemeK = 'bright_light';
              connect.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#fff"});
              break;
            case 'client_dark':
              schemeK = 'space_gray';
              connect.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191a"});
              break;
            case 'space_gray':
              schemeK = 'space_gray';
              connect.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191a"});
              break;
            case 'bright_light':
              schemeK = 'bright_light';
              connect.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#fff"});
              break;
            default:
              schemeK = e.detail.data.scheme;
              console.log('дефолт')
          }
          schemeAttribute.value = schemeK;
          this.setState({ scheme: schemeK });
          document.body.attributes.setNamedItem(schemeAttribute);
          break;

          case 'VKWebAppAllowNotificationsResult':
          this.setState({ noty: e.detail.data.result });
          break;

        case 'VKWebAppStorageGetResult':

          const get = async () => {
            let fac = e.detail.data.keys[0].value;
            let gr = e.detail.data.keys[1].value;
            console.table('VKWebAppStorageGetResult',  e.detail.data);
            let w = await this.api.GetWeek();
            this.setState({
              week: w,
              startWeek: w
            });
            if(!w) this.errorHappend();
            let banners = await this.api.GetBanners(fac ? fac : '');
            this.setState({ banners: banners });

            if(fac !== '' && !fac.startsWith('?')){
              this.setState({ faculty: fac });
              this.getGroups(fac, true);
              console.log('факультет обнаружен', fac);
            }
            if(!gr.startsWith('?') && gr !== ''/* gr.split('')[0] === fac.split('')[0]*/){
              this.setState({ group: gr });
              console.log('группа обнаружена', gr);
              this.setSchedule(gr, true, true);
            } else {
              console.log('группа не найдена, держи онбординг');
              this.setState({
                activePage: 'onbording'
              });
            }
          };
          get();

          break;
        default: break;
      }
    });
      connect.send('VKWebAppGetUserInfo');
      connect.send("VKWebAppStorageGet", {"keys": ["faculty", "group"]});
  }

  getDeadlines = () => {
    this.setState({
      deadlines: false,
      expDeadlines: false,
      deadtab: 'active',
      popout: null
    });
    this.api.GetUserDeadlines(this.state.fetchedUser.id).then(deadlines => {
      this.setState({ deadlines });
    }).catch(() => {
      this.openErrorSnackbar('Произошла ошибка загрузки. #4');
      this.setState({ deadlines: [] });
    });
  };

  getExpDeadlines = () => {
    this.setState({
      expDeadlines: false,
      deadlines: false,
      deadtab: 'expires',
      popout: null
    });
    this.api.GetUserExpDeadlines(this.state.fetchedUser.id).then(expDeadlines => {
      this.setState({ expDeadlines });
    }).catch(() => {
      this.openErrorSnackbar('Произошла ошибка загрузки. #5');
      this.setState({ expTasks: [] });
    });
  };

  addTask = () => {

    const state = this.state;

    this.setState({
      popout:  <ScreenSpinner />
    });
    const tasks = this.state.deadlines;

    this.api.AddDeadline({
      id: state.fetchedUser.id,
      title: state.title,
      desk: state.desk ? state.desk : '',
      time: state.time ? `${state.date}-${state.time}` : '',
    }).then(res => {
      if(res === 'success' ){
        this.setState({
          title: '',
          desk: '',
          time: '00:00',
          deadPanel: 'main'
        });
        tasks.push({
          title: state.title,
          desk: state.desk ? state.desk : '',
          time: state.time ? state.time : '',
          done: false
        });
        console.log(tasks);
        this.setState({ tasks: tasks });
        if(state.deadtab === 'active') {
          this.getDeadlines();
        } else {
          this.getExpDeadlines();
        }
        console.log('good')
      } else {
        this.openErrorSnackbar('Произошла ошибка. #1');
        this.api.AddDeadline({
          id: state.fetchedUser.id,
          title: state.title,
          desk: state.desk ? state.desk : '',
          time: state.time ? state.time : '',
        });
      }
    }).catch(() => {
      this.openErrorSnackbar('Произошла ошибка. #2');
      this.api.AddDeadline({
        id: this.state.fetchedUser.id,
        title: state.title,
        desk: state.desk ? state.desk : '',
        time: state.time ? state.time : '',
      });
    })
  };

  openAlert = (key, e) => {
    this.setState({ popout:
        <Alert
          actionsLayout="vertical"
          actions={[{
            title: 'Удалить',
            autoclose: true,
            mode: 'destructive',
            action: () => this.delTask(key, e),
          }, {
            title: 'Отмена',
            autoclose: true,
            mode: 'cancel'
          }]}
          onClose={() => this.setState({
            popout: null
          })}
        >
          <h2>Подтвердите действие</h2>
          <p>Вы уверены, что хотите удалить дедлайн? <br/> Действие нельзя отменить.</p>
        </Alert>
    });
  };

  delTask = (key,e) => {
    let deadlines = this.state.deadlines || this.state.expDeadlines;
    this.setState({ popout: <ScreenSpinner/> });
    this.api.Delete({ note: e }).then(res => {
      this.setState({
        popout: null,
        modal: null
      });
      if(res !== 'success'){
        this.openErrorSnackbar('Произошла ошибка. #7');
        return;
      }
      deadlines[key].done = deadlines[key].done === 1 ? 0 : 1;

      deadlines = deadlines.filter(el => el.id !== e);

      if(this.state.deadtab === 'active') {
        this.setState({ deadlines });
      } else {
        this.setState({ expDeadlines: deadlines });
      }
      /*
      if(this.state.tab === 'active') {
        this.getTasks();
      } else {
        this.getExpTasks();
      }*/
    })

  };

  check = (key, id) => {
    let deadlines = this.state.deadlines || this.state.expDeadlines;
    this.api.Done({
      done: deadlines[key].done === 1 ? 0 : 1,
      note: deadlines[key].id
    }).then((res) => {

      if(res !== 'success'){
        this.openErrorSnackbar('Произошла ошибка. #6');
        return;
      }
     /* deadlines[key].done = deadlines[key].done === 1 ? 0 : 1;

      deadlines = deadlines.filter(e => e.id !== id);

      if(this.state.tab === 'active') {
        this.setState({ deadlines });
      } else {
        this.setState({ expDeadlines: deadlines });
      }*/

      if(this.state.deadtab === 'active') {
        this.getDeadlines();
      } else {
        this.getExpDeadlines();
      }
    });

  };

  changeTask = e => {

    this.setState({
      popout:  <ScreenSpinner />
    });

    this.api.Change({
      id: e.id,
      title: e.title,
      desk: e.desk || '',
      time: e.time
    }).then((res) => {

      if(res !== 'success'){
        this.openErrorSnackbar('Произошла ошибка. #10');
        return;
      }

      this.setState({
        deadPanel:  'main'
      });

      if(this.state.deadtab === 'active') {
        this.getDeadlines();
      } else {
        this.getExpDeadlines();
      }
    });

  };

  openDoneSnackbar = e => {
    this.setState({ snackbar:
        <Snackbar
          duration={2000}
          layout="vertical"
          onClose={() => this.setState({ snackbar: null })}
          before={<Avatar size={24} style={{ backgroundColor: '#4bb34b' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
        >
          {e}
        </Snackbar>,
      popout: null
    });
  };

  openErrorSnackbar = e => {
    this.setState({ snackbar:
        <Snackbar
          duration={2000}
          layout="vertical"
          onClose={() => this.setState({ snackbar: null })}
          before={<Avatar size={24} style={{ backgroundColor: '#FF0000' }}><Icon16Clear fill="#fff" width={14} height={14} /></Avatar>}
        >
          {e}
        </Snackbar>,
      popout: null
    });
  };

  changePage(name) {
    this.setState({
      activePage: name,
      week: this.state.startWeek
    });
  }

  errorHappend() {
    if(this.state.snackbar) return;
    this.setState({ snackbar:
        <Snackbar
          layout="vertical"
          duration={20000}
          onClose={() => this.setState({ snackbar: null })}
          before={<Avatar size={24} style={{ backgroundColor: '#fff'}} ><Icon16Like fill="#FF3347 " width={24} height={24} /></Avatar>}
        >
        <div style={{ fontWeight: 400 }}>  Мы устали и лежим. И вы пока отдохните!</div>
        </Snackbar>
    });

  }

  goBack() {
    if(this.state.activePanel === 'office') {
      this.setState({ activePanel: 'archive' });
      return;
    }
    if(this.state.modal){
      this.setState({ modal: null });
    } else {
      connect.send("VKWebAppClose", {
        "status": "success",
        "text": "Будем рады видеть вас вновь!"
      });
    }
  }

  getOffices = async (fac) => {
      let result = await this.api.GetOffices(fac ? fac : '');
      if(result.length === 0){
        this.errorHappend();
        return;
      }
      this.setState({
        offices: result
      });
   };

  getGroups = async (fac, load) => {
    console.log(3);
    this.setState({ groupsLoading: true });
    if(load) this.setState({ isLoaded: load });

    let result = await this.api.GetGroups(fac);
    if(result.length === 0){
      this.errorHappend();
      return;
    }
    const gr = result.map((r) => (
      <option value={r.group} key={r.group}>{r.group}</option>
    ));
    this.setState({
      groups: gr,
      groupsLoading: false
     })
  };

  setSchedule = async (group, go = true, openSchedule = false) => {
    console.log(2);
    if(!group){
      this.errorHappend();
      return;
    }
    let schedule = await this.api.GetSchedule(group);

    if(schedule.length === 0){
      console.log(1, schedule, this.state.activePage);
      if(this.state.activePage === 'load') {
        console.log('!')
        this.setState({
          activePage: 'first'
        })
      }
      this.errorHappend();
      return;
    }
    if(!schedule && go && this.state.activePage !== 'onbording') {
        this.setState({ activePage: 'onbording' });
        return;
    }
    const even = schedule.filter(e =>  // четная
        e.WeekCode === '2'
    );
    const odd = schedule.filter(e =>  // нечетная
        e.WeekCode === '1'
    );
    const getEven = () => {
      let evn = [];
      evn.push(even.filter(e => e.DayTitle === 'Понедельник'));
      evn.push(even.filter(e => e.DayTitle === 'Вторник'));
      evn.push(even.filter(e => e.DayTitle === 'Среда'));
      evn.push(even.filter(e => e.DayTitle === 'Четверг'));
      evn.push(even.filter(e => e.DayTitle === 'Пятница'));
      evn.push(even.filter(e => e.DayTitle === 'Суббота'));
      return evn;
    };
    const getOdd = () => {
      let od = [];
      od.push(odd.filter(e => e.DayTitle === 'Понедельник'));
      od.push(odd.filter(e => e.DayTitle === 'Вторник'));
      od.push(odd.filter(e => e.DayTitle === 'Среда'));
      od.push(odd.filter(e => e.DayTitle === 'Четверг'));
      od.push(odd.filter(e => e.DayTitle === 'Пятница'));
      od.push(odd.filter(e => e.DayTitle === 'Суббота'));
      return od;
    };

    const shed = {
      GroupName: group,
      even: getEven(),
      odd: getOdd()
    };
    if(!this.state.week) console.log('пиздец');
    this.setState({ schedule: shed });
    if(openSchedule) {
      this.setState({ activePage: 'schedule' });
    }
    let news = await this.api.GetNews('');
    this.setState({ news: news });
  };

  render() {
    const {
      fetchedUser, banners, news, scheme, schedule, activePage,
       activePanel
    } = this.state;

    const onCloseModal = () => {
      this.setState({ modal: null });
    };
    const ucFirst = str => {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    };
    const openDeadlineModal = key => {
      this.setState({
        modal: 'task',
        curTask: this.state.deadlines[key] || this.state.expDeadlines[key],
        curKey: key
      });
    };

    const MLD = this.state.modalLessonData;
    const deadline = this.state.curTask;
    const key = this.state.curKey;

    const modal = (

      <ModalRoot activeModal={this.state.modal}>

        <ModalPage
          id='task'
          onClose={onCloseModal}
          header={
            <ModalPageHeader
              left={
                IS_PLATFORM_ANDROID ?
                  <PanelHeaderButton onClick={onCloseModal}><Icon24Cancel /></PanelHeaderButton>
                  :
                  (
                    <div style={{ display: 'flex'}}>
                      <PanelHeaderButton onClick={() => this.openAlert(key, deadline.id)}>
                        <Icon24Delete fill='#ccc'/>
                      </PanelHeaderButton >
                      <PanelHeaderButton
                        onClick={() => this.setState({
                          deadPanel: 'change',
                          modal: null,
                          snackbar: null
                        })}>
                        <Icon24Write fill='#ccc'/>
                      </PanelHeaderButton >
                    </div>
                  )
              }
              right={(
                <>
                  {IS_PLATFORM_ANDROID ?
                    (
                      (
                        <div style={{ display: 'flex'}}>
                          <PanelHeaderButton onClick={() => this.openAlert(key, deadline.id)}>
                            <Icon24Delete fill='#ccc'/>
                          </PanelHeaderButton >
                          <PanelHeaderButton
                            onClick={() => this.setState({
                              deadPanel: 'change',
                              modal: null,
                              snackbar: null
                            })}>
                            <Icon24Write fill='#ccc'/>
                          </PanelHeaderButton >
                        </div>
                      )
                    )
                    : <PanelHeaderButton onClick={onCloseModal}> <Icon24Dismiss /> </PanelHeaderButton> }
                </>
              )}
            >
              Информация
            </ModalPageHeader>
          }
        >
          <Group header={<Header mode="primary">{deadline && deadline.title}</Header>}>
            <List>
              {
                deadline.desk &&
                <Cell multiline>
                  <InfoRow header="Описание">
                    {deadline.desk}
                  </InfoRow>
                </Cell>
              }
              <Cell multiline>
                {
                  deadline.time &&
                  <InfoRow header="Крайний срок выполнения">
                    {moment(deadline.time, 'YYYY-MM-DD-hh-mm').fromNow()}
                  </InfoRow>
                }
              </Cell>
            </List>
            <Div style={{ marginTop: -5, padding: 20 }}>
              <Button
                size='xl'
                onClick={() => {
                  onCloseModal(key);
                  this.check(key, deadline.id);
                }}
                mode={deadline.done === 1? 'commerce' : 'primary'}
              >{deadline.done === 1 ? 'Дедлайн выполнен' : 'Выполнить'}
              </Button>
            </Div>
            <Div/>
          </Group>
        </ModalPage>

        <ModalPage
          id='lesson'
          onClose={onCloseModal}
          header={
            <ModalPageHeader
              left={
                IS_PLATFORM_ANDROID &&
                <PanelHeaderButton onClick={onCloseModal}><Icon24Cancel /></PanelHeaderButton>
              }
              right={(
                <>
                  {!IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={onCloseModal}><Icon24Dismiss /></PanelHeaderButton > }
                </>
              )}
            >
              Информация о занятии
            </ModalPageHeader>
          }
        >
          <Group header={<Header>{MLD && MLD.title}</Header>}>
            <List>
              {
                MLD && MLD.form &&
                <Cell>
                  <InfoRow /*style={{ lineHeight: 1 }}*/ header="Форма занятия">
                    {MLD.form}
                  </InfoRow>
                </Cell>
              }
              <Cell multiline>
                {
                  MLD && MLD.teacher ?
                    <InfoRow /*style={{ marginBottom: -8 }}*/ header="Преподаватель">
                      {MLD.teacher}
                    </InfoRow>
                    :
                    <InfoRow /*style={{ marginBottom: -8 }}*/ header="Преподаватель">
                      Не указан
                    </InfoRow>
                }
              </Cell>
              {
                MLD && MLD.time &&
                <Cell>
                  <InfoRow /*style={{ marginBottom: -8 }}*/ header="Начало и конец занятия">
                    {MLD.time}
                  </InfoRow>
                </Cell>
              }
              <Cell>
                {
                  MLD && MLD.aud ?
                    <InfoRow /*style={{ marginBottom: -8 }}*/ header="Аудитория">
                      {MLD.aud.includes('*') ? 'Новый корпус,' : 'Главный корпус,'} {ucFirst(MLD.aud)}
                    </InfoRow>
                    :
                    <InfoRow header="Аудитория">
                      Не указана
                    </InfoRow>
                }
              </Cell>
            </List>
            <Div style={{ marginTop: -5, padding: 20 }}>
              <Button
                size='xl'
                component='a'
                href='https://vk.me/club187168548'
                level='secondary'
                target='_blank'
              >Сообщить об ошибке
              </Button>
            </Div>
          </Group>
        </ModalPage>
        <ModalPage
          id='geo'
          onClose={onCloseModal}
          header={
            <ModalPageHeader
              left={
                IS_PLATFORM_ANDROID &&
                <PanelHeaderButton onClick={onCloseModal}><Icon24Cancel /></PanelHeaderButton>
              }
              right={(
                <>
                  {!IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={onCloseModal}><Icon24Dismiss /></PanelHeaderButton> }
                </>
              )}
            >
              Местоположение
            </ModalPageHeader>
          }
        >
          <Div style={{ padding: 20 }}>
            {this.state.geoModalData || ''}
          </Div>
        </ModalPage>
      </ModalRoot>
    );
    const openModal = data => {
        this.setState({
          modal: 'lesson',
          modalLessonData: data
        });
    };

    const {
      getGroups, setSchedule, getOffices, getDeadlines, getExpDeadlines, changeTask, check,
      openErrorSnackbar, openDoneSnackbar, addTask
    } = this;

    const state = this.state;

    const openGeo = e => {
      this.setState({
        modal: 'geo',
        geoModalData: e
      });
    };

    const props = { setParentState: this.setState.bind(this), news, openGeo,
      getDeadlines, getExpDeadlines, check, changeTask, openDeadlineModal,
      getGroups, banners, setSchedule, getOffices, fetchedUser, openModal, state,
      openErrorSnackbar, openDoneSnackbar, addTask
    };

    const tabbar = (
      <Tabbar  className={state.scheme === 'bright_light' ? '' : 'tabbar'}>
        <TabbarItem
          className={state.scheme === 'bright_light' ? 'tblight' : 'tbdark'}
          onClick={() => {
            this.changePage('feed');
            if(activePanel !== 'feed') this.setState({ activePanel: 'feed' });
          }}
          selected={activePage === 'feed'}
        >
          <Icon28ArticleOutline />
           </TabbarItem>
        {/* admins.includes(fetchedUser.id) &&*/
                <TabbarItem
                  className={state.scheme === 'bright_light' ? 'tblight' : 'tbdark'}
                  onClick={() => this.changePage('time')}
                  selected={activePage === 'time'}
                >
                  <Icon28FireOutline />
                </TabbarItem>
          }

        <TabbarItem
          className={state.scheme === 'bright_light' ? 'tblight' : 'tbdark'}
          onClick={() => this.changePage('schedule')}
          selected={activePage === 'schedule'}
        >
          <Icon20CalendarOutline width={28} height={28} />
        </TabbarItem>


         <TabbarItem
           className={state.scheme === 'bright_light' ? 'tblight' : 'tbdark'}
            onClick={() => {
              this.setState({
                activePanel: 'archive',
                activePage: 'archive'
              });
            }}
            selected={activePage === 'archive'}
          >
            <Icon28ArchiveOutline />
          </TabbarItem>


        <TabbarItem
          className={state.scheme === 'bright_light' ? 'tblight' : 'tbdark'}
          onClick={() => this.changePage('profile') }
          selected={activePage === 'profile'}
        >
          <Icon28Profile />
        </TabbarItem>
      </Tabbar>
    );

    if(admins.includes(fetchedUser.id)) {
      window.eruda.init();
    }
    return (
      <ConfigProvider isWebView scheme={scheme}>
      <Epic activeStory={activePage} tabbar={(activePage === 'first' || activePage === 'onbording' || activePage === 'load') ? [] : tabbar}>
        <View id="feed" activePanel='feed' >
          <NewsFeed id="feed" {...props}/>
        </View>

        <View modal={modal} popout={this.state.popout} id="time" activePanel={this.state.deadPanel}>
          <Deadlines className='noselect' id="main" {...props} />
          <Add id="add" {...props} />
          <Change id="change" task={state.curTask} {...props} />
        </View>


        <View
          className='noselect'
          modal={modal}
          id="schedule"
          activePanel="schedule"
        >
          <Schedule id="schedule" {...props} scheme={this.state.scheme} schedule={schedule} />
        </View>

        <View
          className='noselect'
          modal={modal}
          history={this.state.activePanel === 'office' ? ['archive', 'office'] :  ['archive']}
          id="archive"
          activePanel={this.state.activePanel}
          onSwipeBack={() => this.setState({
            activePanel: 'archive',
            modal: null
          })}
        >
          <Archive id="archive" {...props}  />
          <Office className={state.scheme === 'bright_light' ? 'office noselect' : 'officeD noselect'} id="office" {...props}  />
        </View>

        <View className={state.scheme === 'bright_light' ? 'profileL noselect' : 'profileD noselect'} id="profile" activePanel="profile">
          <Profile className={state.scheme === 'bright_light' ? 'profileL' : 'profileD'} id="profile" {...props}  />
        </View>

        <View className='noselect' id="first" activePanel="first">
          <FirstScr id="first" {...props} />
        </View>

        <View id="load" activePanel="load">
          <Panel separator={false} id='load'>
          <Spinner style={{ marginTop: '35vh' }} size="large" />
          </Panel>
        </View>

        <View className='noselect' id="onbording" activePanel="onbording">
          <Onboarding
            {...props}
            id="onbording"
            pages={[
              { image: state.scheme === 'bright_light' ? light1 : dark1 , title: 'Встречайте — Военмех Go', subtitle: 'Первый локальный студенческий сервис\n внутри социальной сети.\n Не нужно ничего скачивать и устанавливать —\n это чудесно, не правда ли?' },
              { image: state.scheme === 'bright_light' ? light2 : dark2 , title: 'Следи за новостями!', subtitle: 'В этом разделе у нас царит гармония и порядок:\nвсе новости отсортированы по хэштегам,\nпоэтому ты не пропустишь ничего важного.' },
          /*    { image: state.scheme === 'bright_light' ? light2 : dark2 , title: 'Создавай дедлайны!', subtitle: 'Укажи название задачи, комментарий и время.\nКогда сроки начнут гореть, —\nсервис пришлет уведомление ВКонтакте.' },*/
              { image: state.scheme === 'bright_light' ? light4 : dark4 , title: 'Смотри расписание!', subtitle: 'Свайпни календарь, чтобы увидеть\nрасписание на следующую неделю.\nПри нажатии на занятие будет отображаться\nболее детальная информация о нём.' },
          //    { image: state.scheme === 'bright_light' ? light4 : dark4 , title: 'Самое важное в архиве!', subtitle: 'Здесь размещена полезная информация\nдля каждого студента Военмеха.\nНе отвлекай никого — посмотри в архиве.' },
              { image: state.scheme === 'bright_light' ? light6 : dark6 , title: 'Настрой сервис под себя!', subtitle: 'В профиле ты сможешь\n изменить факультет или группу, а также\n включить уведомления, \nчтобы всегда быть в курсе событий.' },
              { image: state.scheme === 'bright_light' ? light7 : dark7 , title: 'Почти готово!', subtitle: 'Осталось дело за малым:\nдобавь сервис в избранное, чтобы не потерять его\n и наслаждаться функционалом сервиса в полной мере.' },
            ]}
          />
        </View>
      </Epic>
      </ConfigProvider>
    );
  }
}

export default App;
