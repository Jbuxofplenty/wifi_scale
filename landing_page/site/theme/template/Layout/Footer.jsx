import React from 'react';

class Footer extends React.PureComponent {
  render() {
    const { pathname } = this.props.location;
    return (
      <footer id="footer" className="dark">
        <div className="bottom-bar">
          &copy;
          {' '}
          {1900 + new Date().getYear()}
          {' '}
          STEMIC LLC
        </div>
      </footer>
    );
  }
}

export default Footer;
