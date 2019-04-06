import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '../ModalPanel';
import {
  addFavoriteDice,
  removeFavoriteDice,
  updateFavoriteDice,
  saveSettings,
} from '../../../redux/actions/settings';

import './UserSettings.scss';

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.dispatch(saveSettings());
  }

  _handleAddFavoriteDice() {
    this.props.dispatch(addFavoriteDice());
  }

  _handleRemoveFavoriteDice(index) {
    this.props.dispatch(removeFavoriteDice(index));
  }

  render() {
    return (
      <ModalPanel title="个人设置" className="user-settings">
        <p>常用骰子:</p>
        <div className="user-favorite-list">
          {this.props.userSettings.get('favoriteDice').map((item, index) => (
            <div className="user-favorite-item" key={'favorite-dice#' + index}>
              <input
                value={item.get('title')}
                onChange={(e) =>
                  this.props.dispatch(
                    updateFavoriteDice(index, {
                      title: e.target.value,
                      value: item.get('value'),
                    })
                  )
                }
                placeholder="标题"
              />
              <input
                value={item.get('value')}
                onChange={(e) =>
                  this.props.dispatch(
                    updateFavoriteDice(index, {
                      title: item.get('title'),
                      value: e.target.value,
                    })
                  )
                }
                placeholder="骰值"
              />
              <button
                title="移除该项"
                onClick={() => this._handleRemoveFavoriteDice(index)}
              >
                <i className="iconfont">&#xe657;</i>
              </button>
            </div>
          ))}
          <button onClick={() => this._handleAddFavoriteDice()}>
            <i className="iconfont">&#xe604;</i>
          </button>
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state) => ({
  userSettings: state.getIn(['settings', 'user']),
}))(UserSettings);
