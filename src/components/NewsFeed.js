import React, { Component } from 'react';
import {
  Panel, PanelHeader, Search, Cell, Separator, IS_PLATFORM_ANDROID
} from '@vkontakte/vkui';
import '../css/newsfeed.css';
import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
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
  onChange(search) {
    console.log(5, search)
    this.setState({ search: search.replace(/\s+/g, ' ') });
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
      && this.sposts.map((post) => (
        <a style={{
          textDecoration: 'none'
        }} href={post.link || ''} rel="noopener noreferrer" target='_blank' key={post.id}>
          <Cell
            size="l"
            expandable
            multiline
            onClick={() => {}}
            asideContent={IS_PLATFORM_ANDROID ? <Icon24Chevron className="Cell__chevron" /> : ''}
            bottomContent={(
              <div>
                <div className="post_td">
                  <div className="post_tags">
                    {post.tags.map((tag, id) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div className={ this.props.state.scheme === 'space_gray' ?
                      'post_tagDark' : 'post_tag'
                    } key={id}>{`#${tag/*.toLowerCase()*/}`}</div>
                    ))}
                  </div>
                </div>
                <div className="post_bot">
                  <div className="post_date">
                    {post.date && post.time && `${post.date} в ${post.time} · `}
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
          <Separator wide/>
        </a>
      ));

    const zaglushka = (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      >
        <span style={{
          marginTop: '45px', fontWeight: '450', color: '#7f8285', width: '80%', textAlign: 'center'
        }}
        >
Новостей по запросу
          <br />
не найдено!
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
