const {
  RESET,
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  ADD_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
} = require('../constants');
const config = require('../../../config/project.config');

const immutable = require('immutable');
const initialState = immutable.fromJS({
  ...config.defaultSettings,
  notificationPermission: 'default', // granted, denied, default in web
});

module.exports = function settings(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case SET_USER_SETTINGS:
      return state.set('user', state.get('user').merge(immutable.Map(action.payload)));
    case SET_SYSTEM_SETTINGS:
      return state.set('system', state.get('system').merge(immutable.Map(action.payload)));
    case UPDATE_NOTIFICATION_PERMISSION:
      return state.set('notificationPermission', action.payload);
    case ADD_FAVORITE_DICE:
      return state.updateIn(['user', 'favoriteDice'], list => list.push(immutable.fromJS({title: '常用骰', value: '1d100'})))
    case UPDATE_FAVORITE_DICE:
      return state.setIn(['user', 'favoriteDice', action.index], immutable.fromJS(action.payload))
    default:
      return state;
  }
}
