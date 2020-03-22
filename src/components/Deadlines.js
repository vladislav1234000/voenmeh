import React, { Component } from 'react';

import {
  Panel, PanelHeader, Div, Tabs, TabsItem, Button, Spinner, Separator, FixedLayout, Radio, InfoRow,
} from '@vkontakte/vkui';

import Icon24Add from '@vkontakte/icons/dist/24/add';

import '../css/deadlines.css';

import moment from 'moment';

class Deadlines extends Component {


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
        <img alt='' src={'https://vk.com/images/blog/about/img_about_1_2x.png'} style={{ width: '90%', marginTop: '20vh' }} />
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
      <Panel id="time">
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
          marginBottom: 5
        }}/>
        <Div>

          <Div>
            {
              deadlines.length > 0 ? deadlines.map((e, key) => (
                <div key={key} >

                  { key !== 0 && <Separator/> }

                  <div style={{
                    display: 'flex',
                    borderRadius: 10,
                    marginBottom: 10,
                    marginTop: 5,
                    height: '8vh',
                    backgroundColor: props.state.scheme === 'bright_light' ? '#f5f5f5' : '#232324'
                  }}>
                    <div style={{
                      width: '12vw',
                      marginTop: '3%'
                    }}>
                      <Radio
                        checked={deadlines[key].done}
                        onChange={() => props.check(key, deadlines[key].id)}
                      />
                    </div>
                    <div
                      className={`test111 ${props.state.scheme === 'bright_light' ? 'light' : 'dark'}`}
                      onClick={() => props.openDeadlineModal(key)}
                    >
                      <div className='test2111'>
                        {e.title.length < 30 ? e.title : `${e.title.split('').slice(0,30).join('')}...`}
                      </div>
                      <div style={{
                        marginTop: 10,
                        fontSize: 12,
                        marginLeft: 5
                      }}>
                        {moment(e.time, 'YYYY-MM-DD-hh-mm').fromNow()}
                      </div>
                    </div>
                  </div>

                </div>
              )) : deadlines !== [] && tab === 'active' && zaglushka
            }
          </Div>

          {
            <Div>
              {
                expDeadlines.length > 0 ? expDeadlines.map((e, key) => (
                  <div key={key} >

                    { key !== 0 && <Separator/> }

                    <div style={{
                      display: 'flex',
                      borderRadius: 10,
                      marginBottom: 10,
                      marginTop: 5,
                      backgroundColor: props.state.scheme === 'bright_light' ? '#f5f5f5' : '#232324'
                    }}>
                      <div style={{ width: '12vw' }}>
                        <Radio
                          checked={expDeadlines[key].done}
                          onChange={() => props.check(key, expDeadlines[key].id)}
                        />
                      </div>
                      <div
                        className={`test ${props.state.scheme === 'bright_light' ? 'light' : 'dark'}`}
                        onClick={() => props.openDeadlineModal(key)}
                      >
                        <div className='test2'>
                          {e.title.length < 30 ? e.title : `${e.title.split('').slice(0,30).join('')}...`}
                        </div>
                      </div>
                    </div>

                  </div>
                )) : expDeadlines !== [] && tab === 'expires' && zaglushka
              }
            </Div>
          }
          {
            ((!deadlines && tab === 'active') || ( !expDeadlines && tab === 'expires' )) && <Spinner style={{ marginTop: '10%'}}/>
          }
          {
            tab === 'active' &&
            <FixedLayout vertical="bottom">
              <Div style={{
                textAlign: 'center'
              }}>
              <Button
                style={{
                  borderRadius: 6,
                  weight: '20',
                  backgroundColor: '#f25d44',
                  color: '#fff',
                  marginBottom: 20
                }}
                before={ <Icon24Add /> }
                size='l' onClick={() => {
                setPState({ activeView: 'add' });
              }}
              >
              Создать дедлайн
              </Button>
              </Div>
            </FixedLayout>
          }
        </Div>
      </Panel>
    );
  }
}

export default Deadlines;
