import React, { Component } from 'react';
import connect from '@vkontakte/vk-bridge';
import {
  Epic, Tabbar, TabbarItem, Snackbar, Div, ConfigProvider, View, IS_PLATFORM_ANDROID, Spinner, Header,
  ModalRoot, ModalPage, PanelHeaderButton, Avatar, ModalPageHeader, Group, List, Cell, InfoRow, Button
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './css/main.css';
import './css/first.css';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon16Like from '@vkontakte/icons/dist/16/like';

import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
//import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
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
      activePage: 'profile', // first !!
      activePanel: 'archive',
      history: ['feed'],
      fetchedUser: {
        id: 1
      },
      classTab: '',
      office: [],
      isOfficeOpened: false,
      group: false,
      isLoaded: false,
      news: [],
      banners: [],
      schedule: {},
      groups: [],
      scheme: false ? 'space_gray' : 'bright_light',
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
      headman: false
    };
    this.api = new API();
  }

  componentDidMount() {
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
    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      this.goBack();
    }, false);

    if (window.location.port === '8080') this.setState({ isLoaded: true });

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

        case 'VKWebAppViewRestore' :
         // window.location.reload();
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
              this.setScheduleNEW(gr, true, true);
            } else {
              console.log('группа не найдена, держи онбординг');
              this.setState({
                activePage: 'onbording',
                isLoaded:  true
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


  changePage(name) {
    this.setState({
      activePage: name,
      week: this.state.startWeek
    });
  }

  errorHappend(bruh) {
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

    this.setState({ groupsLoading: true });
    if(load) this.setState({ isLoaded: load });

    let result = await this.api.GetGroups(fac);
    if(result.length === 0){
      this.errorHappend();
      return;
    };
    const gr = result.map((r) => (
      <option value={r.group} key={r.group}>{r.group}</option>
    ));
    this.setState({
      groups: gr,
      groupsLoading: false
     })
  };


  setScheduleNEW = async (group, go = true, openSchedule = false) => {

    if(!group){
      this.errorHappend();
      return;
    }
    let schedule = await this.api.GetSchedule(group);
    if(schedule.length === 0){
      this.errorHappend();
      return;
    }
    if(!schedule && go) {
      if(this.state.activePage !== 'onbording'){
        this.setState({ isLoaded: true });
        this.setState({ activePage: 'onbording' });
      }
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
      this.setState({ isLoaded: true });
    }
    let news = await this.api.GetNews('');
    this.setState({ news: news });
  };
  render() {
    const {
      isLoaded, fetchedUser, banners, news, scheme, schedule, activePage,
       activePanel, classTab
    } = this.state;

    const onCloseModal = () => {
      this.setState({ modal: null });
    };
    const ucFirst = str => {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    };

    const openModal = data => {
        this.setState({
          modal: (
            <ModalRoot activeModal='lesson'>
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
            <Group header={<Header>{data.title && data.title}</Header>}>
              <List>
                {
                  data.form &&
                  <Cell>
                    <InfoRow /*style={{ lineHeight: 1 }}*/ header="Форма занятия">
                      {data.form}
                    </InfoRow>
                  </Cell>
                }
                  <Cell multiline>
                  {
                      data.teacher ?
                      <InfoRow /*style={{ marginBottom: -8 }}*/ header="Преподаватель">
                       {data.teacher}
                      </InfoRow>
                      :
                      <InfoRow /*style={{ marginBottom: -8 }}*/ header="Преподаватель">
                       Не указан
                      </InfoRow>
                  }
                  </Cell>
                {
                  data.time &&
                  <Cell>
                    <InfoRow /*style={{ marginBottom: -8 }}*/ header="Начало и конец занятия">
                      {data.time}
                    </InfoRow>
                  </Cell>
                }
                <Cell>
                {
                    data.aud ?
                    <InfoRow /*style={{ marginBottom: -8 }}*/ header="Аудитория">
                     {data.aud.includes('*') ? 'Новый корпус,' : 'Главный корпус,'} {ucFirst(data.aud)}
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
            </ModalRoot>
          )
        });
    };

    const { getGroups, setScheduleNEW, getOffices } = this;

    const state = this.state;

    const openGeo = e => {
      this.setState({
        modal: (
          <ModalRoot activeModal='lesson'>
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
                      {!IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={onCloseModal}><Icon24Dismiss /></PanelHeaderButton> }
                    </>
                  )}
                >
                  Местоположение
                </ModalPageHeader>
              }
            >
              <Div style={{ padding: 20 }}>
                  {e}
              </Div>
            </ModalPage>
          </ModalRoot>
        )
      });
    };

    const props = { setParentState: this.setState.bind(this), news, openGeo,
      getGroups, banners, setScheduleNEW, getOffices, fetchedUser, openModal, state };

    const tabbar = (
      <Tabbar className={classTab}>
        <TabbarItem
          onClick={() => {
            this.changePage('feed');
            if(activePanel !== 'feed') this.setState({ activePanel: 'feed' });
          }}
          selected={activePage === 'feed'}
        >
          <Icon28ArticleOutline />
           </TabbarItem>
        {/*
                <TabbarItem
                  onClick={() => this.changePage('time')}
                  selected={activePage === 'time'}
                >
                  <Icon28FireOutline />
                </TabbarItem>
                */}

        <TabbarItem
          onClick={() => this.changePage('schedule')}
          selected={activePage === 'schedule'}
        >
          <Icon20CalendarOutline width={28} height={28} />
        </TabbarItem>


         <TabbarItem
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
          onClick={() => this.changePage('profile') }
          selected={activePage === 'profile'}
        >
          <Icon28Profile />
        </TabbarItem>
      </Tabbar>
    );

    if (!isLoaded) return <Spinner size="large" />;


    if(admins.includes(fetchedUser.id)) {
      window.eruda.init();
    }
    return (
      <ConfigProvider isWebView scheme={scheme}>
      <Epic activeStory={activePage} tabbar={(activePage === 'first' || activePage === 'onbording') ? [] : tabbar}>
        <View modal={this.state.modal} id="feed"  activePanel='feed' >
          <NewsFeed id="feed" {...props}/>
        </View>

        <View id="time" activePanel="time">
          <Deadlines id="time" {...props} />
        </View>

        <View modal={this.state.modal} id="schedule" activePanel="schedule">
          <Schedule id="schedule" {...props} scheme={this.state.scheme} schedule={schedule} />
        </View>

        <View
          modal={this.state.modal}
          history={this.state.activePanel === 'office' ? ['archive', 'office'] :  ['archive']}
          id="archive"
          activePanel={this.state.activePanel}
          onSwipeBack={() => this.setState({
            activePanel: 'archive',
            modal: null
          })}
        >
          <Archive id="archive" {...props}  />
          <Office className={state.scheme === 'bright_light' ? 'office' : 'officeD'} id="office" {...props}  />
        </View>

        <View className={state.scheme === 'bright_light' ? 'profileL' : 'profileD'} id="profile" activePanel="profile">
          <Profile className={state.scheme === 'bright_light' ? 'profileL' : 'profileD'} id="profile" {...props}  />
        </View>

        <View id="first" activePanel="first">
          <FirstScr id="first" {...props} />
        </View>

        <View id="onbording" activePanel="onbording">
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
