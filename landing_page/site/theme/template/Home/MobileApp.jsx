import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';

import { Link } from 'react-router';

class MobileApp extends React.PureComponent {
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
    return (
      <div className="home-page-wrapper carousel">
        <OverPack
          className="page"
          playScale={0.6}
          id="mobile-app"
        >
          <QueueAnim
            className="page-text"
            key="text"
            type="bottom"
            leaveReverse
            delay={[0, 100]}
          >
            <h1 key="h1">Our Mobile App</h1>
            <p key="p">
              Our MVP is ready to be demoed for different businesses! We'll be hosting the app soon on the App Store and Google Play Store.
            </p>
          </QueueAnim>
          <TweenOne
            animation={{ delay: 200, ...this.props.tweenAnim }}
            key="img"
            className="home-anim-demo"
          >
            <div className="carousel-container">
              <Carousel renderThumbs={() => null} infiniteLoop autoPlay={true} showStatus={false}>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app1.PNG?alt=media&token=e5e0dd01-f5f6-4f18-98d1-e83858406958" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app2.PNG?alt=media&token=82ca1911-50ab-475b-9ce7-0ed5e3e13b53" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app3.PNG?alt=media&token=241515a4-f0d4-46d7-a139-1e3fd831affd" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app4.PNG?alt=media&token=994196f4-afdf-4454-8df2-e78069f60ef1" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app5.PNG?alt=media&token=60599f51-d6f5-45a2-83a0-1711774da6ac" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app6.PNG?alt=media&token=1b8d9ad6-2882-4069-858c-54391bfb0ae9" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/app7.PNG?alt=media&token=63c5f2c1-43a5-415a-8189-0bc3921a638c" />
                  </div>
                  <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/wifi-scale-9b7b1.appspot.com/o/IMG_0514.png?alt=media&token=9ccc1f5d-7ebd-46e4-92f0-fc78a8c42c32" />
                  </div>
              </Carousel>
            </div>
          </TweenOne>
        </OverPack>
      </div>
    );
  }
}

export default injectIntl(MobileApp);
