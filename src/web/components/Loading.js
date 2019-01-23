const React = require('react');
const PropTypes = require('prop-types');
require('./Loading.scss');

class Loading extends React.Component {
  render() {
    let body = '';
    if (this.props.show) {
      body = (
        <div className="mask">
          <div className="content">
            <div className="spinner">
              <div className="rect1" />
              <div className="rect2" />
              <div className="rect3" />
              <div className="rect4" />
              <div className="rect5" />
            </div>
            <span>{this.props.text}</span>
          </div>
        </div>
      );
    }

    return <div className="loading">{body}</div>;
  }
}

Loading.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};

module.exports = Loading;
