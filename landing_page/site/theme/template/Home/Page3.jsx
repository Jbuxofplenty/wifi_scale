import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { FormattedMessage } from 'react-intl';
import * as utils from '../utils';

export default class Page3 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // Invoke cloud function here
  }

  resetForm() {
    this.setState({ name: '', email: '', message: '' });
  }

  onNameChange(event) {
	  this.setState({ name: event.target.value });
  }

  onEmailChange(event) {
	  this.setState({ email: event.target.value });
  }

  onMessageChange(event) {
	  this.setState({ message: event.target.value });
  }

  render() {
    return (
      <footer className="home-page-wrapper page3">
        <OverPack
          className="page"
          playScale={0.3}
          id="page3"
        >
          <QueueAnim
            key="text"
            className="page-text white-text"
            type="bottom"
            leaveReverse
          >
            <h1 key="h1"><FormattedMessage id="app.home.page3.title" /></h1>
            <p>
              Email:
              <a className="page3-link" href="mailto:frey@stemicllc.com">  frey@stemicllc.com</a>
            </p>
            <p>
              Phone:
              <a className="page3-link" href="tel:610-742-1777">  (610) 742-1777</a>
            </p>
          </QueueAnim>
        </OverPack>
      </footer>
    );
  }
}
