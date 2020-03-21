import React, { Component } from 'react';
import {
  Panel, PanelHeader, Search, Cell, Separator
} from '@vkontakte/vkui';
import '../css/newsfeed.css';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';

import { FaCircle } from 'react-icons/fa';

import Carousel from './Carousel.js';

class NewsFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  /* поиск */
  onChange(e) {
    this.setState({ search: e.currentTarget.value.replace(/\s+/g, ' ') });
  }

  get sposts() {
    const search = this.state.search.toLowerCase();
    const { news } = this.props;
    if (search.substr(0, 1) === '#') {
      return news.filter(({ tags }) => tags.join(' ').toLowerCase().indexOf(search.substr(1)) > -1);
    }

    return news.filter(({ title, author }) => (title + author).toLowerCase().indexOf(search) > -1);
  }

  render() {
    const posts = this.sposts.length > 0
      && this.sposts.map((post, key) => (
        <a style={{
          textDecoration: 'none'
        }} href={post.link || ''} rel="noopener noreferrer" target='_blank' key={key}>
        <div className='type' id={post.type === 'Мероприятие' ? 'mp' : 'other'} style={{ display: 'flex' }}>
          <FaCircle className='FaCircle' />
          <div className='event'>
            {post.type.toUpperCase()}
          </div>
        </div>

          <Cell
            size="l"
            multiline
            before={ <div className={`brdr ${post.type}`}/>}
            onClick={() => {}}
            asideContent={ <Icon24Chevron className="str Cell__chevron" /> }
            bottomContent={(
              <div>
                <div className="post_bot">
                  <div className="post_date">
                    {`${post.date} · `}
                  </div>
                  <div className="post_author">
                    {post.author && `${post.author}`}
                  </div>
                </div>
              </div>
            )}
          >
            <div className="post_title">{post.title}</div>
          </Cell>
          <Separator />
        </a>
      ));

    const zaglushka = (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <img alt='' src={'https://vk.com/images/blog/about/img_about_1_2x.png'} style={{ width: '90%', marginTop: '10vh' }} />
        <span style={{
          marginTop: '40px',
          fontWeight: 'bold',
          color: '#191919',
          width: '80%',
          textAlign: 'center',
          fontSize: '5vw'
        }}
        >
         Наша команда искала, но
          <br/>
          так и не смогла найти новостей
          <br/>
          по твоему запросу
            </span>
      </div>
    );


    return (
      <Panel id="feed">
        <PanelHeader>Новости</PanelHeader>
        <Search value={this.state.search} onChange={this.onChange} className="NewsFeedSearch" />
        {
          this.state.search.length === 0 &&
          <Carousel list={this.props.banners} autoplay sizePadding={52.63} />
        }
        { this.sposts.length === 0 && zaglushka }
        <div className="posts">{posts}</div>
      </Panel>
    );
  }
}

export default NewsFeed;
