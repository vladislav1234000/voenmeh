import React, { Component } from 'react';
import connect from '@vkontakte/vk-connect';
import {
  Epic, Tabbar, TabbarItem, Div, ConfigProvider, View, IS_PLATFORM_ANDROID, Spinner,
  ModalRoot, ModalPage, ModalPageHeader, HeaderButton, Group, List, Cell, InfoRow
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import '../css/main.css';
import '../css/first.css';

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon20CalendarOutline from '@vkontakte/icons/dist/20/calendar_outline';
import Icon28ArchiveOutline from '@vkontakte/icons/dist/28/archive_outline';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28KeyOutline from '@vkontakte/icons/dist/28/key_outline';

import Schedule from './Schedule.jsx';
import Archive from './Archive.jsx';
import Profile from './Profile.jsx';

import AdminPage from './AdminPage.jsx';
import AdminAddNews from './AdminAddNews.jsx';
import AdminSendNoty from './AdminSendNoty.jsx';

import FirstScr from './FirstScr.jsx';
import NewsFeed from './NewsFeed.jsx';
import Deadlines from './Deadlines.jsx';
import Page from './Page.jsx';
import API from '../helpers/API.js';
import APII from '../helpers/apii.js';

import Onboarding from './onboardingPanels/Onboarding.jsx';

import dark1 from './onboardingPanels/dark1.png';
import dark2 from './onboardingPanels/dark2.png';
//import dark3 from './onboardingPanels/dark3.png';
import dark4 from './onboardingPanels/dark4.png';
//import dark5 from './onboardingPanels/dark5.png';
import dark6 from './onboardingPanels/dark6.png';

import light1 from './onboardingPanels/light1.png';
import light2 from './onboardingPanels/light2.png';
//import light3 from './onboardingPanels/light3.png';
import light4 from './onboardingPanels/light4.png';
//import light5 from './onboardingPanels/light5.png';
import light6 from './onboardingPanels/light6.png';

// Sends event to client
//connect.send('VKWebAppSetViewSettings', { status_bar_style: 'light', action_bar_color: '#19191a' });
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
      activePage: localStorage.group !== undefined ? 'schedule' : 'onbording',
      activePanel: 'feed',
      adminPagePanel: 'admin',
      history: ['feed'],
      fetchedUser: {
        id: 1
      },
      data: '',
      classTab: '',
      height: 0,
      isLoaded: false,
      news: [],
      banners: [],
      schedule: {},
      groupsList: [],
      scheme: false ? 'space_gray' : 'bright_light',
      modal: null,
      noty: false
    };
    this.api = new APII();
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.setState({ noty: ordered.vk_are_notifications_enabled === 1 ? true : false })
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('popstate', () => {
      const his = [...this.state.history];
      his.pop();
      const active = his[his.length - 1];
      if (active === 'feed') {
        connect.send('VKWebAppDisableSwipeBack');
        console.log('swipeBack off');
      }
      this.setState({ history: his, activePanel: active });
    }, false);

    if (localStorage.getItem('group')) this.setSchedule();

    API.request('getBanners', null, 'GET', 1).then((banners) => {
      this.setState({ banners });
      API.request('getNews', null, 'GET', 1).then((news) => {
        this.setState({ news });
        this.setState({ isLoaded: true });
      }).catch((e) => {
        console.error(e);
        this.setState({ isLoaded: true });
      });
    }).catch((e) => {
      console.error(e);
      this.setState({ isLoaded: true });
    });

    API.request('getGroups', null, 'GET', 1).then((groupsList) => {
      this.setState({ groupsList });
    }).catch((e) => {
      console.error(e);
    });

    this.pool(180);

    connect.subscribe((e) => {
    //  if(e.detail.data) console.log(e.detail.type, e.detail.data)
      switch (e.detail.type) {
        case 'VKWebAppGetUserInfoResult':
          this.setState({ fetchedUser: e.detail.data });
          console.log(e.detail.type, e.detail.data);
          break;
          case 'VKWebAppUpdateConfig':
          console.log(e.detail.data.scheme)
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
        default:
          // code
      }
    });
      connect.send('VKWebAppGetUserInfo');
      this.setSchedule()
  }

  setSchedule(group = localStorage.getItem('group')) {
    console.log(group)
    group = '2286'
    //this.setScheduleNEW('ВЕ256')
    API.request(`getSchedule/${group}`, null, 'GET', 1).then((schedule) => {
      this.setState({ schedule });
      console.log(schedule)
    }).catch(console.error);
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

  pool(interval) {
    return setInterval(() => {
      if (localStorage.getItem('group')) this.apiCall(`getSchedule/${JSON.parse(localStorage.getItem('group')).id}`);
      this.apiCall('getNews');
    }, interval * 1000);
  }

  updateDimensions() {
    const { height } = this.state;
    this.setState({ classTab: (IS_PLATFORM_ANDROID && (window.innerHeight < height)) ? 'tabbarDisable' : '' });
  }

  apiCall(method) {
    let name;
    switch (method) {
      case 'getBanners':
        name = 'banners';
        break;
      case 'getNews':
        name = 'news';
        break;
      default:
        name = 'schedule';
        break;
    }

    API.request(method, null, 'GET', 1).then((value) => {
      this.setState({ [name]: value });
    }).catch(console.error);
  }

  goBack() {
    window.history.back();
  }

  // метод добавления перехода из истории аппы
  goForward(activePanel) {
    const history = [...this.state.history];
    history.push(activePanel);

    if (this.state.activePanel === 'feed') {
      connect.send('VKWebAppEnableSwipeBack');
    }
    window.history.pushState({}, '', activePanel);

    this.setState({ history, activePanel });
  }
  setScheduleNEW = async (group = localStorage.getItem('group')) => {

    const schedule = await this.api.GetSchedule(group);

    this.setState({ schedule });
    console.log(this.state)
  }
  render() {
    const {
      isLoaded, fetchedUser, banners, news, scheme, schedule, activePage, activePanel, history, data, classTab
    } = this.state;

    const id = fetchedUser.id;
    const isAdmin = id===462723039||id===236820864||id===198082755||id===87478742;



    const onCloseModal = () => {
      this.setState({ modal: null })
    }
    const openModal = data => {
        this.setState({
          modal: (
            <ModalRoot activeModal='lesson'>
            <ModalPage
              id='lesson'
              onClose={onCloseModal}
              header={
                <ModalPageHeader
                  right={<HeaderButton onClick={onCloseModal}>{!IS_PLATFORM_ANDROID ? <Icon24Cancel /> : <Icon24Dismiss />}</HeaderButton>}
                >
                  Информация о занятии
                </ModalPageHeader>
              }
            >
            <Group title={data.title}>
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
                       По распределению
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
                     {data.aud}
                    </InfoRow>
                    :
                    <InfoRow title="Аудитория">
                     По распределению
                    </InfoRow>
                }
                </Cell>
              </List>
              <Div/>
            </Group>
            </ModalPage>
            </ModalRoot>
          )
        })
    }
    const setScheduleNEW = this.setScheduleNEW;
    const state = this.state;
    const props = { setScheduleNEW, setParentState: this.setState.bind(this), fetchedUser, openModal, state }
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
      {
        isAdmin &&
        <TabbarItem
          onClick={() => this.changePage('admin') }
          selected={activePage === 'admin'}
        >
          <Icon28KeyOutline />
        </TabbarItem>
      }
      </Tabbar>
    );

    if (localStorage.getItem('group')) {
      // расписание
      if (!(isLoaded && 'GroupName' in schedule)) return <Spinner size="large" />;
    } else {
      // онбординг
      if (!isLoaded) return <Spinner size="large" />;
    }
    //console.log(history)
    return (
      <ConfigProvider scheme={scheme}>
      <Epic activeStory={activePage} tabbar={(activePage === 'first' || activePage === 'onbording') ? null : tabbar}>
        <View
          modal={this.state.modal}
          id="feed"
          activePanel={activePanel}
          history={history}
          onSwipeBack={this.goBack}
        >
          <NewsFeed id="feed" {...props} variable={this} updateData={this} banners={banners} News={news} />
          <Page id="page" {...props} variable={this} data={data} />
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
          <Profile className={state.scheme === 'bright_light' ? 'profileL' : 'profileD'} id="profile" {...props} variable={this} groupsList={this.state.groupsList} />
        </View>

        <View id="admin" activePanel={this.state.adminPagePanel}>
          <AdminPage id="admin" {...props} variable={this}  />
          <AdminSendNoty id="noty" {...props} variable={this} />
          <AdminAddNews id="news" {...props} variable={this}  />
        </View>

        <View id="first" activePanel="first">
          <FirstScr id="first" {...props} variable={this} groupsList={this.state.groupsList} />
        </View>

        <View id="onbording" activePanel="onbording">
          <Onboarding
            variable={this}
            {...props}
            id="onbording"
            pages={[
              { image: state.scheme === 'bright_light' ? light1 : dark1 , title: 'Встречайте —\nВоенмех Go', subtitle: 'Первый локальный студенческий сервис\n внутри социальной сети.\n Не нужно ничего скачивать и устанавливать —\n это чудесно, не правда ли?' },
              { image: state.scheme === 'bright_light' ? light2 : dark2 , title: 'Следи за новостями!', subtitle: 'В этом разделе у нас царит гармония и порядок:\nвсе новости отсортированы по хэштегам,\nпоэтому ты не пропустишь ничего важного.' },
          /*    { image: state.scheme === 'bright_light' ? light2 : phone2Dark , title: 'Создавай дедлайны!', subtitle: 'Укажи название задачи, комментарий и время.\nКогда сроки начнут гореть —\nсервис пришлет уведомление ВКонтакте.' },*/
              { image: state.scheme === 'bright_light' ? light4 : dark4 , title: 'Смотри расписание!', subtitle: 'Свайпни календарь и выбери дату,\nчтобы посмотреть расписание на другой день.' },
          //    { image: state.scheme === 'bright_light' ? light4 : dark4 , title: 'Самое важное в архиве!', subtitle: 'Здесь размещена полезная информация\nдля каждого студента Военмеха.\nНе отвлекай никого — посмотри в архиве.' },
          //    { image: state.scheme === 'bright_light' ? light5 : dark5 , title: 'Настрой сервис под себя!', subtitle: 'В профиле ты сможешь изменить факультет или группу,\n а также включить уведомления, чтобы всегда быть в курсе.' },
              { image: state.scheme === 'bright_light' ? light6 : dark6 , title: 'Почти готово!', subtitle: 'Осталось дело за малым:\nдобавь сервис в избранное, чтобы не потерять его\n и наслаждаться функционалом сервиса в полной мере.' },
            ]}
          />
        </View>
      </Epic>
      </ConfigProvider>
    );
  }
}

export default App;
