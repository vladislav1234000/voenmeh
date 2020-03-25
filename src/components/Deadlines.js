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
        <img alt='' src={'https://vk.com/images/blog/about/img_about_1_2x.png'} style={{ width: '90%', marginTop: '25%' }} />
        <span style={{
          marginTop: '40px',
          fontWeight: 'bold',
          color: this.props.state.scheme === 'bright_light' ? '#000' : '#6d7885',
          width: '80%',
          textAlign: 'center',
          fontSize: '5vw'
        }}
        >
       Дедлайнов нет
          <br/>
        <div style={{
          marginTop: '10px',
          fontWeight: 500,
          color: this.props.state.scheme === 'bright_light' ? '#99a2ad' : '#6d7885',
          fontSize: '4vw'
        }}>Кажется, у тебя всё под контролем!</div>
            </span>
      </div>
    );

    return (
      <Panel id={this.props.id}>
        <PanelHeader>Дедлайны</PanelHeader>
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
        <Separator style={{
          marginTop: 0,
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
                        onClick={() => setTimeout(() => setPState({
                          modal: null
                        }), 5)}
                      />
                    </div>
                    <div>
                      <div className='test2111'>
                        {e.title.length < 30 ? e.title : `${e.title.split('').slice(0,30).join('')}...`}
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
                            onClick={() => setTimeout(() => setPState({
                              modal: null
                            }), 5)}
                          />
                        </div>
                        <div>
                          <div className='test2111'>
                            {e.title.length < 30 ? e.title : `${e.title.split('').slice(0,30).join('')}...`}
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
                  deadPanel: 'add'
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
