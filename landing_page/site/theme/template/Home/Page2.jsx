import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';

import { Link } from 'react-router';

import * as utils from '../utils';

const exhibition = {
  1: {
    title: 'adam',
    meta: {
      image: 'https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/adam.jpeg?alt=media&token=afb9afe4-d760-4000-b7d2-1769d084b965',
      filename: '',
      order: 2,
      content: 'Adam Winchell\n\nFounder & Algorithms Guru',
    },
  },
  2: {
    title: 'josiah',
    meta: {
      image: 'https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/josiah_buxton.jpg?alt=media&token=a0502a79-6889-4647-9dde-bf42ee439b0f',
      filename: 'test',
      order: 1,
      content: 'Josiah Buxton\n\nFounder & Chief Architect',
    },
  },
};
class Page2 extends React.PureComponent {
  static propTypes = {
    pageData: PropTypes.object,
    utils: PropTypes.object,
    tweenAnim: PropTypes.object,
    onButtonClick: PropTypes.func,
  };

  static defaultProps = {
    pageData: {},
    utils: {},
    tweenAnim: {},
    onButtonClick: () => {
    },
  };

  render() {
    const { locale } = this.props.intl;
    const demoToChildren = Object.keys(exhibition)
      .map((key) => exhibition[key])
      .sort((a, b) => b.meta.order - a.meta.order)
      .filter((key, i) => i < 6)
      .map((item) => {
        const img = item.meta.image;
        const link = item.meta.filename.replace(/(\/index)|(.md)/g, '');
        const title = item.meta.title;
        const content = this.props.utils.toReactComponent(item.meta.content);
        return (
          <li key={link}>
            <Link to={link} onClick={this.props.onButtonClick}>
              <div className="home-anim-demo-img"><img src={img} width="100%" alt="img" /></div>
              <h2>{title}</h2>
              <div className="home-anim-demo-text">{content}</div>
            </Link>
          </li>
        );
      });

    return (
      <div className="home-page-wrapper page2">
        <OverPack
          className="page"
          playScale={0.6}
          id="page2"
        >
          <QueueAnim
            className="page-text"
            key="text"
            type="bottom"
            leaveReverse
            delay={[0, 100]}
          >
            <h1 key="h1"><FormattedMessage id="app.header.menu.exhibition" /></h1>
            <p key="p">
              <FormattedMessage id="app.home.page2.content" />
            </p>
          </QueueAnim>
          <TweenOne
            animation={{ delay: 200, ...this.props.tweenAnim }}
            key="img"
            className="home-anim-demo"
          >
            <ul>
              {demoToChildren}
            </ul>
          </TweenOne>
        </OverPack>
      </div>
    );
  }
}

export default injectIntl(Page2);
