import React, { Component } from 'react';
import { Panel, PanelHeader, Div, Spinner } from '@vkontakte/vkui';
import '../css/archive.css';

//import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';

class Archive extends Component {
/*  constructor(props) {
    super(props);
  }*/

  componentDidMount() {
   this.props.getOffices();
  }

  render() {

    if(!this.props.state.offices) return (
      <Panel id="archive">
        <PanelHeader>Полезное</PanelHeader>
       <Div>
         <Spinner />
       </Div>
      </Panel>
    );

    return (
      <Panel id="archive">
        <PanelHeader>Полезное</PanelHeader>

        {/* <Div>
       <div className="MeetBox"  style={{ backgroundImage }} />
       <Div>
         <div>
           <div className="Header__in">
             <div>
               <div style={{
                 fontWeight: 500,
                 fontSize: '20px',
                 marginTop: -10
               }}
               >
                 Здравпункт
               </div>
               <div style={{
                 display: 'flex',
                 marginTop: 5,
                 alignItems: 'center',
                 fontSize: 15
               }}
               > <Icon28RecentOutline
                    width={16}
                    heigth={16}
                    style={{ marginRight: 10 }}
                    fill='#ff0000'
               />
               <div style={{ display: 'inline-flex', marginTop: -4 }}>
                 <div style={{ color: '#ff0000' }}>{`закрыто `}</div>
                 {` • сегодня работает с 10:00 до 19:30`}
                 </div>
               </div>
             </div>
           </div>
         </div>
         <Separator style={{ marginTop: 10 }} />
       </Div>
    </Div>*/}
       {
         this.props.state.offices.reverse().map((e, key) => (
           <Div key={key}>
             <ul className="vendor-list__ul">
               <li className="vendor-item">
                 <div className="vendor-item__link">
                <span className="vendor-item__images"><span
                  className="vendor-item__cover"
                  style={{
                    backgroundImage: `url(${e.photo || 'https://sun9-69.userapi.com/c855720/v855720034/160918/11gmBBLhMOk.jpg'})`
                  }}>
                </span>
                  </span>
                   <span className="vendor-item__wrap">
                  <span className="vendor-item__headrow">
                    <span className="vendor-item__title">
                      <span className="vendor-item__title-text">
                        {e.name}
                      </span>
                    </span>
                  </span>
                    {/*
                     <span className="vendor-item__delivery-info">
                      <span  className="vendor-item__delivery-time is-express">
                        25-35 мин
                      </span>
                    </span>
                  */}
                  <span  className="vendor-item__row">
                    <span className="vendor-item__stars rating rating--medium">
                      <div className="rating__row rating__row--medium">
                        <span className="rating__star rating__star--medium">

                        </span>
                        <span className="rating__value rating__value--medium">
                          4.7
                        </span>
                      </div>
                    </span>
                    <div className="vendor-item__info-specialisations">
                      От 1 ₽ • Бургеры,  Фастфуд<
                      /div>
                    </span>
                    </span>
                 </div>
               </li>

             </ul>
           </Div>
         ))
       }
      </Panel>
    );
  }
}

export default Archive;
