import React, { Component } from 'react';

import {
  Panel, PanelHeader, Div, Tabs, TabsItem, Button, Spinner, Separator, FixedLayout, Checkbox, FormStatus
} from '@vkontakte/vkui';

import Icon24Add from '@vkontakte/icons/dist/24/add';

import '../css/deadlines.css';

import moment from 'moment';

class Deadlines extends Component {

componentDidMount() {
  !window.location.port && this.props.getDeadlines();
}

  render() {

    const props = this.props;
    const state = props.state;
    const deadlines = state.deadlines;
    const expDeadlines = state.expDeadlines;
    const tab = state.deadtab;
    const setPState = props.setParentState;
    const getDeadlines = props.getDeadlines;
    const getExpDeadlines = props.getExpDeadlines;

    const zaglushka = (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <img alt='' src={'https://vk.com/doc462723039_543562650?hash=5b7999da49eacbcf6f&dl=ca51e0c29e19cf5633'} style={{ width: '90%', marginTop: '25%' }} />
        <span
          className='placeholder'
          style={{
          marginTop: '40px',
          color: this.props.state.scheme === 'bright_light' ? '#000' : '#e2e3e6',
          width: '80%',
          textAlign: 'center',
          fontSize: '5vw'
        }}
        >
       Сейчас у тебя нет
          <br/>
        <div
          className='placeholder'
          style={{
        /*  marginTop: '10px',*/
          color: this.props.state.scheme === 'bright_light' ? '#000' : '#e2e3e6',
          fontSize: '5vw'
        }}>{`${props.state.deadtab === 'active' ? 'активных' : 'завершенных'} дедлайнов`}</div>
            </span>
      </div>
    );

    return (
      <Panel id={this.props.id}>
        <PanelHeader>Дедлайны</PanelHeader>
        <FixedLayout vertical="top">
          <Tabs>
            <TabsItem
              className={this.props.state.scheme === 'bright_light' ? 'tablight' : 'tabdark'}
              onClick={ getDeadlines }
              selected={ tab === 'active' }
            >
              Активные
            </TabsItem>
            <TabsItem
              className={this.props.state.scheme === 'bright_light' ? 'tablight' : 'tabdark'}
              onClick={ getExpDeadlines }
              selected={ tab === 'expires' }
            >
              Завершенные
            </TabsItem>
          </Tabs>
        </FixedLayout>
        <Separator style={{
          marginTop: '13%',
          marginBottom: 5
        }} wide/>
        <Div>

          <>
            {
              deadlines.length > 0 ? deadlines.map((e, key) => (
                <Div key={key} >

                  { /*key !== 0 && <Separator/> */}
                  <div
                    className={props.state.scheme === 'bright_light' ? 'light' : 'dark'}
                    onClick={() => props.openDeadlineModal(key)}
                  >
                  <FormStatus
                    className={`deadlineItem ${props.state.scheme === 'bright_light' ? 'light' : 'dark'}`}
                    style={{ backgroundColor: props.state.scheme === 'bright_light' ? '#f5f5f5' : '#232324' }}>
                    <div style={{ display: 'flex' }}>
                    <div style={{
                      width: '12vw'
                    }}>
                      <Checkbox
                        className='chk'
                        checked={deadlines[key].done}
                        onChange={() => props.check(key, deadlines[key].id)}
                        onClick={() => {
                          setPState({
                            display: false
                          });
                          setTimeout(() => setPState({
                            display: true,
                            modal: null
                          }), 500)
                        }}
                      />
                    </div>
                    <div>
                      <div className='test2111'>
                        {e.title.length < 30 ? e.title : `${e.title.split('').slice(0,25).join('')}...`}
                      </div>
                      {
                        e.time &&
                        <div className='deaddata'>
                          {`${moment(e.time, 'YYYY-MM-DD-hh-mm').format('LLL').split(' ').slice(0,2).join(' ')} в ${moment(e.time, 'YYYY-MM-DD-hh-mm').format('LT')} · ${moment(e.time, 'YYYY-MM-DD-hh-mm').fromNow()}`}
                        </div>
                      }
                    </div>
                    </div>
                  </FormStatus>
                  </div>
                </Div>
              )) : deadlines !== false && tab === 'active' && zaglushka
            }
          </>

          {
            <>
              {
                expDeadlines.length > 0 ? expDeadlines.map((e, key) => (
                  <Div key={key} >

                    {/* key !== 0 && <Separator/> */}

                    <div
                      className={props.state.scheme === 'bright_light' ? 'light' : 'dark'}
                      onClick={() => props.openDeadlineModal(key)}
                    >
                    <FormStatus
                      className='deadlineItem'
                      style={{ backgroundColor: props.state.scheme === 'bright_light' ? '#f5f5f5' : '#232324' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{
                          width: '12vw'
                        }}>
                          <Checkbox
                            className='chk'
                            checked={expDeadlines[key].done}
                            onChange={() => props.check(key, expDeadlines[key].id)}
                            onClick={() => {
                              setPState({
                                display: false
                              });
                              setTimeout(() => setPState({
                                display: true,
                                modal: null
                              }), 500)
                            }}
                          />
                        </div>
                        <div>
                          <div className='test2111'>
                            {e.title.length < 30 ? e.title : `${e.title.split('').slice(0,25).join('')}...`}
                          </div>
                          {
                            e.time &&
                            <div className='deaddata'>
                              {`${moment(e.time, 'YYYY-MM-DD-hh-mm').format('LLL').split(' ').slice(0,2).join(' ')} в ${moment(e.time, 'YYYY-MM-DD-hh-mm').format('LT')} · ${moment(e.time, 'YYYY-MM-DD-hh-mm').fromNow()}`}
                            </div>
                          }
                        </div>
                      </div>
                    </FormStatus>
                    </div>
                  </Div>
                )) :  expDeadlines !== false && tab === 'expires' && zaglushka
              }
            </>
          }
          {
            ((!deadlines && tab === 'active') || ( !expDeadlines && tab === 'expires' )) && <Spinner style={{ marginTop: '10%'}}/>
          }
          {
            tab === 'active' &&
            <FixedLayout vertical="bottom">
              <Div>
              <Button
                style={{
                  marginBottom: 10
                }}
                onClick={() => setPState({
                  modal: 'add',
                  title: '',
                  desk: '',
                  time: '00:00',
                  date: `${new Date().getFullYear()}-${(new Date().getMonth()) < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate()}`
                })}
                before={ <Icon24Add /> }
                size='xl'
              >
              Создать дедлайн
              </Button>
              </Div>
            </FixedLayout>
          }
        </Div>
        <Div style={{ padding: 30 }}/>
        {props.state.snackbar}
      </Panel>
    );
  }
}

export default Deadlines;
