import React, { Component } from 'react';
import connect from '@vkontakte/vk-connect';
import {
  Epic, Tabbar, TabbarItem, Div, ConfigProvider, View, IS_PLATFORM_ANDROID, Spinner,
  ModalRoot, ModalPage, ModalPageHeader, Group, List, Cell, InfoRow, Button
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './css/main.css';
import './css/first.css';

import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
//import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon20CalendarOutline from '@vkontakte/icons/dist/20/calendar_outline';
//import Icon28ArchiveOutline from '@vkontakte/icons/dist/28/archive_outline';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';

import Schedule from './components/Schedule.js';
import Archive from './components/Archive.js';
import Profile from './components/Profile.js';

import FirstScr from './components/FirstScr.js';
import NewsFeed from './components/NewsFeed.js';
import Deadlines from './components/Deadlines.js';
import Page from './components/Page.js';

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

const qs = require('querystring');
var params = window.location.search.replace('?', '').replace('%2C', ',');

const urlParams = qs.parse(params);
const ordered = {};
Object.keys(urlParams).sort().forEach((key) => {
    if (key.slice(0, 3) === 'vk_') {
        ordered[key] = urlParams[key];
    }
});

if (connect.supports('VKWebAppResizeWindow')) {
  connect.send('VKWebAppResizeWindow', { width: 800, height: 1000 });
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 'onbording', // schedule
      activePanel: 'feed',
      adminPagePanel: 'admin',
      history: ['feed'],
      fetchedUser: {
        id: 1
      },
      data: '',
      classTab: '',
      height: 0,
      group: false,
      isLoaded: false,
      news: [],
      banners: [],
      schedule: {},
      groups: [],
      scheme: false ? 'space_gray' : 'bright_light',
      modal: null,
      lessons: [],
      noty: false,
      week: false,
      groupsLoading: false
    };
    this.api = new API();
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.setState({ noty: ordered.vk_are_notifications_enabled === 1 ? true : false })
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      const his = [...this.state.history];
      his.pop();
      const active = his[his.length - 1];
      this.setState({ modal: null });
      if(active === 'feed') connect.send('VKWebAppDisableSwipeBack');
      this.setState({ history: his, activePanel: active });
    }, false);

    this.setState({ isLoaded: true });

    connect.subscribe((e) => {
      switch (e.detail.type) {
        case 'VKWebAppGetUserInfoResult':

          this.setState({ fetchedUser: e.detail.data });

          break;
        case 'VKWebAppUpdateConfig':

          const schemeAttribute = document.createAttribute('scheme');
          let schemeK = e.detail.data.scheme;

          switch (schemeK) {
            case 'client_light':
              schemeK = 'bright_light'
              connect.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#4680C2"});
              break;
            case 'client_dark':
              schemeK = 'space_gray'
              connect.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191a"});
              break;
            default:
              schemeK = e.detail.data.scheme
          }
          schemeAttribute.value = schemeK;
          this.setState({ scheme: schemeK });
          document.body.attributes.setNamedItem(schemeAttribute);

          break;
          case 'VKWebAppAllowNotificationsResult':

          this.setState({ noty: e.detail.data.result });

          break;
        case 'VKWebAppStorageGetResult':
          console.table(e.detail.data.keys)
          let fac = e.detail.data.keys[0].value
          let gr = e.detail.data.keys[1].value;

          if(fac !== '' && !fac.startsWith('?')){
            this.setState({ faculty: fac });
            this.getGroups(fac);
          }
          if(!gr.startsWith('?') && gr !== ''/* gr.split('')[0] === fac.split('')[0]*/){
            this.setState({ group: gr });
            this.setScheduleNEW(gr, true, true);
          } else {
            this.setState({ activePage: 'onbording' });
          }
          break;
        default: break;
      }
    });
      connect.send('VKWebAppGetUserInfo');
      connect.send("VKWebAppStorageGet", {"keys": ["faculty", "group"]});
  }


  changePage(name) {
    this.setState({ height: window.innerHeight });
    this.updateDimensions();
    this.setState({ activePage: name });
  }

  changePanel(name) {
    this.setState({ activePanel: name });
  }

  updateData(value) {
    this.setState({ data: value });
  }

  updateDimensions() {
    const { height } = this.state;
    this.setState({ classTab: (IS_PLATFORM_ANDROID && (window.innerHeight < height)) ? 'tabbarDisable' : '' });
  }

  goBack() {
    window.history.back();
    this.setState({ modal: null });
  }

  goForward(activePanel) {
    const history = [...this.state.history];
    history.push(activePanel);

    if (this.state.activePanel === 'feed') {
      connect.send('VKWebAppEnableSwipeBack');
    }
    window.history.pushState({}, '', activePanel);

    this.setState({ history, activePanel });
  }

   getGroups = async (fac, load = true) => {
    if(load) this.setState({ isLoaded: false });
    let w = await this.api.GetWeek();
    this.setState({ week: w });
    this.getBanners(fac);
    this.getNews(fac);
    this.setState({ groupsLoading: true });
    let result = await this.api.GetGroups(fac);
    if(!result) result = [];
    const gr = result.map((r) => (
      <option value={r.group} key={r.group}>{r.group}</option>
    ));
    this.setState({
      groups: gr,
      groupsLoading: false,
      isLoaded: true
     })
  };

  getBanners = async (fac) => {
      let result = await this.api.GetBanners(fac ? fac : '');
      this.setState({ banners: result });
  }

  getNews = async (fac) => {
      let result = await this.api.GetNews(fac ? fac : '');
      this.setState({ news: result });
  }

  setScheduleNEW = async (group, go = true, openSchedule = false) => {
    if(!group) return
    let schedule = await this.api.GetSchedule(group);
    if(!schedule && go) {
      if(this.state.activePage !== 'onbording'){
        this.setState({ activePage: 'onbording' });
      }
      return
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
    }

    const shed = {
      GroupName: group,
      even: getEven(),
      odd: getOdd()
    };

    this.setState({ schedule: shed });
    if(openSchedule) this.setState({ activePage: 'schedule' });
  };
  render() {
    const {
      isLoaded, fetchedUser, banners, news, scheme, schedule, activePage,
       activePanel, history, data, classTab
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
                <ModalPageHeader>
                  Информация о занятии
                </ModalPageHeader>
              }
            >
            <Group title={data.title && data.title}>
              <List>
                {
                  data.form &&
                  <Cell>
                    <InfoRow /*style={{ lineHeight: 1 }}*/ title="Форма занятия">
                      {data.form}
                    </InfoRow>
                  </Cell>
                }
                  <Cell>
                  {
                      data.teacher ?
                      <InfoRow /*style={{ marginBottom: -8 }}*/ title="Преподаватель">
                       {data.teacher}
                      </InfoRow>
                      :
                      <InfoRow /*style={{ marginBottom: -8 }}*/ title="Преподаватель">
                       Не указан
                      </InfoRow>
                  }
                  </Cell>
                {
                  data.time &&
                  <Cell>
                    <InfoRow /*style={{ marginBottom: -8 }}*/ title="Начало и конец занятия">
                      {data.time}
                    </InfoRow>
                  </Cell>
                }
                <Cell>
                {
                    data.aud ?
                    <InfoRow /*style={{ marginBottom: -8 }}*/ title="Аудитория">
                     {data.aud.endsWith('*') ? 'Новый корпус,' : 'Старый корпус,'} {ucFirst(data.aud)}
                    </InfoRow>
                    :
                    <InfoRow title="Аудитория">
                       Не указана
                    </InfoRow>
                }
                </Cell>
              </List>
                <Div style={{ marginBottom: -10, marginTop: -5 }}><Button size='xl' onClick={onCloseModal} level='secondary'>Закрыть</Button></Div>
                <Div/>
          </Group>
            </ModalPage>
            </ModalRoot>
          )
        })
    };

    const { getGroups, setScheduleNEW } = this;
    const state = this.state;

    const variable =  this;
    const props = { setParentState: this.setState.bind(this), news,
      getGroups, variable, data, banners, setScheduleNEW,  fetchedUser, openModal, state }

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
                </TabbarItem>*/}

        <TabbarItem
          onClick={() => this.changePage('schedule')}
          selected={activePage === 'schedule'}
        >
          <Icon20CalendarOutline width={28} height={28} />
        </TabbarItem>

      {/*  <TabbarItem
          onClick={() => this.changePage('archive')}
          selected={activePage === 'archive'}
        >
          <Icon28ArchiveOutline />
        </TabbarItem>*/}

        <TabbarItem
          onClick={() => this.changePage('profile') }
          selected={activePage === 'profile'}
        >
          <Icon28Profile />
        </TabbarItem>
      {/*
        isAdmin &&
        <TabbarItem
          onClick={() => this.changePage('admin') }
          selected={activePage === 'admin'}
        >
          <Icon28KeyOutline />
        </TabbarItem>
      */}
      </Tabbar>
    );

    if (!isLoaded) return <Spinner size="large" />;

    return (
      <ConfigProvider scheme={scheme}>
      <Epic activeStory={activePage} tabbar={(activePage === 'first' || activePage === 'onbording') ? [] : tabbar}>
        <View
          modal={this.state.modal}
          id="feed"
          activePanel={activePanel}
          history={history}
          onSwipeBack={this.goBack}
        >
          <NewsFeed id="feed" {...props}/>
          <Page id="page" {...props}  />
        </View>

        <View id="time" activePanel="time">
          <Deadlines id="time" {...props} />
        </View>

        <View modal={this.state.modal} id="schedule" activePanel="schedule">
          <Schedule id="schedule" {...props} scheme={this.state.scheme} schedule={schedule} />
        </View>

        <View id="archive" activePanel="archive">
          <Archive id="archive" {...props}  />
        </View>

        <View className={state.scheme === 'bright_light' ? 'profileL' : 'profileD'} id="profile" activePanel="profile">
          <Profile className={state.scheme === 'bright_light' ? 'profileL' : 'profileD'} id="profile" {...props} variable={this} />
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
              { image: state.scheme === 'bright_light' ? light4 : dark4 , title: 'Смотри расписание!', subtitle: 'Свайпни календарь и выбери дату, \nчтобы посмотреть расписание на другой день.\nТакже ты можешь нажать на занятие и увидеть более детальную информацию о нём.' },
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
