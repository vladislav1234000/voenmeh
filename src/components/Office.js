
import React from 'react';
import {
  Group, Separator, Link, Panel, PanelHeader, PanelHeaderBack,
} from '@vkontakte/vkui';
import '../css/office.css';

//import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';

import Icon28PlaceOutline from '@vkontakte/icons/dist/28/place_outline';
import Icon56MailOutline from '@vkontakte/icons/dist/56/mail_outline';
import Icon56PhoneOutline from '@vkontakte/icons/dist/56/phone_outline';
import Header from '@vkontakte/vkui/dist/components/Header/Header';

const Office = props => {

    const office = props.state.office;
    const pn = office.time.filter(e => e.day === 1);
    const vt = office.time.filter(e => e.day === 2);
    const sr = office.time.filter(e => e.day === 3);
    const ct = office.time.filter(e => e.day === 4);
    const pt = office.time.filter(e => e.day === 5);
    const sb = office.time.filter(e => e.day === 6);

    return (
      <Panel id={props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={() =>
          props.setParentState({
          activePanel: 'archive'
        })} />}>{office.name.replace('(новый корпус)', '').replace('(старый корпус)', '')}</PanelHeader>



            <div style={{ marginTop: -10 }} className="vendor-item__link">
              <div
                  className="vendor-item__cover2"
                  style={{
                    backgroundImage: `url(${office.photo || 'https://sun9-69.userapi.com/c855720/v855720034/160918/11gmBBLhMOk.jpg'})`
                  }}>
                  </div>
              <Group className="vendor-item__wrap">
                    <span className="vendor-item__title2">
                        {office.name.replace('(новый корпус)', '').replace('(старый корпус)', '')}
                    </span>
                     <span className="vendor-item__delivery-info2">
                      <span className="vendor-item__delivery-time is-express2">
                        {office.id !== 8 ? 'Главный корпус' : 'Новый корпус'}
                      </span>
                    </span>
                {
                  /*
              <div className="vendor-item__row" style={{
                display: 'inline-flex',
                marginTop: 5,
                alignItems: 'center',
                fontSize: 15
              }}
              > <Icon28RecentOutline
                width={16}
                heigth={16}
                style={{ marginRight: 5 }}
                fill='#ff0000'
              />
                   <div className='roboto' style={{ display: 'inline-flex', marginTop: -2 }}>
                       <div style={{ color: '#ff0000', fontWeight: 300 }}>{`закрыто `}</div>
                       {` • сегодня работает с 10:00 до 19:30`}
                  </div>

               </div>
                */
                }
                <Separator style={{ marginTop: 10, marginBottom: -10 }} />
                 <div header={<Header>График работы отдела</Header>} className="vendor-item__title2">
                   График работы отдела
                   <div style={{ marginTop: 10 }} className='roboto'>
                     <div style={{ display: 'flex' }}>пн
                       <div style={{ marginLeft: '20%'}}>
                         {`${pn[0] ? `${pn[0].start} - ${pn[0].finish}${pn[1] ? `, ${pn[1].start} - ${pn[1].finish}` : '' }` : 'выходной'}`}
                       </div>
                     </div>
                    <div style={{ display: 'flex' }}>вт
                        <div style={{ marginLeft: '20%' }}>
                          {`${vt[0] ? `${vt[0].start} - ${vt[0].finish}${vt[1] ? `, ${vt[1].start} - ${vt[1].finish}`  : '' }` : 'выходной'}`}
                       </div>
                  </div>
                     <div style={{ display: 'flex' }}>ср
                       <div style={{ marginLeft: '20%' }}>
                          {`${sr[0] ? `${sr[0].start} - ${sr[0].finish}${sr[1] ? `, ${sr[1].start} - ${sr[1].finish}` : ''  }` : 'выходной'}`}
                       </div>
                    </div>
                     <div style={{ display: 'flex' }}>чт
                       <div style={{ marginLeft: '20%' }}>
                         {`${ct[0] ? `${ct[0].start} - ${ct[0].finish}${ct[1] ? `, ${ct[1].start} - ${ct[1].finish}` : ''  }` : 'выходной'}`}
                       </div>
                    </div>
                      <div style={{ display: 'flex' }}>пт
                       <div style={{ marginLeft: '20%' }}>
                          {`${pt[0] ? `${pt[0].start} - ${pt[0].finish}${pt[1] ? `, ${pt[1].start} - ${pt[1].finish}` : ''  }` : 'выходной'}`}
                       </div>
                    </div>
                     <div style={{ display: 'flex' }}>сб
                       <div style={{ marginLeft: '20%' }}>
                          {`${sb[0] ? `${sb[0].start} - ${sb[0].finish} ${sb[1] ? `, ${sb[1].start} - ${sb[1].finish}` : ''  }` : 'выходной'}`}
                       </div>
                    </div>
                   </div>
                 </div>
                <div style={{ marginTop: 10, marginBottom: -10 }} />
                <div className="vendor-item__title2">
                 Дополнительная информация

                 <div id='clickable' style={{ display: 'flex', marginTop: 10 }}>
                   <div>
                     <Icon56PhoneOutline fill={props.state.scheme === 'bright_light' ? '#9ca2ad' : '#767778'} width={28} height={28} />
                   </div>
                   { /* <Link href={`tel:+7`}>*/}
                   <div style={{ marginLeft: 10, fontWeight: 400, fontSize: 15 }}>{office.phone ? office.phone : 'не указан' }</div>
                   {   /* </Link>*/}
                 </div>
                  <div id='clickable' style={{ display: 'flex', marginTop: 10 }}>
                    <div>
                      <Icon56MailOutline fill={props.state.scheme === 'bright_light' ? '#9ca2ad' : '#767778'} width={28} height={28} />
                    </div>
                    <div style={{ marginLeft: 10, fontWeight: 400, fontSize: 15 }}>{office.email ? office.email : 'не указана' }</div>
                  </div>
                  <div id='clickable' style={{ display: 'flex', marginTop: 10 }}>
                    <div>
                      <Icon28PlaceOutline fill={props.state.scheme === 'bright_light' ? '#9ca2ad' : '#767778'} width={28} height={28} />
                    </div>
                  <Link>
                    <div onClick={() => props.openGeo(office.address)} style={{ marginLeft: 10, fontWeight: 400, fontSize: 14 }}>Подробнее о местоположении</div>
                  </Link>
                  </div>
                </div>
                    </Group>
            </div>


      </Panel>
    );
  }
export default Office;
