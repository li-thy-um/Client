const React = require('react');
const { connect } = require('react-redux');
const dateHelper = require('../../../../utils/dateHelper');
const config = require('../../../../../config/project.config.js');
const ConverseDetail = require('./ConverseDetail');
// const Tab = require('../../../components/Tab');
const { TabsController, Tab } = require('../../../components/Tabs');
const ConvItem = require('../../../components/ConvItem');
const { switchConverse } = require('../../../../redux/actions/chat');
const { showProfileCard } = require('../../../../redux/actions/ui');

require('./ConverseList.scss');

class ConverseList extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSelectConverse(converseUUID, userUUID) {
    console.log('选择会话', converseUUID, '对象', userUUID);
    this.props.dispatch(switchConverse(converseUUID, userUUID));
  }

  getWelcomeMessage() {
    let hours = new Date().getHours();
    if(hours < 6) {
      return '我欲修仙，法力无边。'
    }else if(hours < 12) {
      return '早上好，今天请继续加油！'
    }else if(hours < 18) {
      return '下午好，喝杯茶吧，让精神抖擞起来。'
    }else {
      return '跑团时间到！赶紧找个团一起哈啤！'
    }
  }

  getConverseList() {
    if(this.props.converses.size > 0) {
      let converses = this.props.converses
        .valueSeq()
        .filter((item) => item.get('type')==='user'||item.get('type')==='system')
        .sortBy((item) => new Date(item.get('lastTime')))
        .reverse()
        .map((item, index) => {
          let uuid = item.get('uuid');
          let defaultIcon = uuid === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.user;
          let attachIcon = item.get('type') === 'user' ? this.props.usercache.getIn([item.get('members', 0), 'avatar']) : null;
          let userUUID = item.get('members')
            ? item.get('members').find(i => i !== this.props.userinfo.get('uuid'))
            : uuid;

          return (
            <ConvItem
              key={'converses#'+index}
              icon={item.get('icon') || attachIcon || defaultIcon}
              title={item.get('name')}
              content={item.get('lastMsg')}
              time={item.get('lastTime')?dateHelper.getShortDiff(item.get('lastTime')):''}
              uuid={uuid}
              unread={item.get('unread')}
              isSelected={this.props.selectedUUID === uuid}
              onClick={() => this._handleSelectConverse(uuid, userUUID)}
              hideCloseBtn={false}
            />
          )
        });

      return (
        <div className="converses-list">
          {converses}
        </div>
      );
    }else {
      return (
        <div className="converses-list">
          <div className="converses-tip">{this.props.conversesDesc}</div>
        </div>
      )
    }
  }

  getFriendList() {
    let friends = this.props.friends.toJS();
    let usercache = this.props.usercache;
    return (
      <div className="friend-list">
        {
          friends.length > 0 ? friends.map((item, index) => {
            let uuid = item;
            return (
              <ConvItem
                key={`friends#${uuid}#${index}`}
                icon={usercache.getIn([uuid, 'avatar']) || config.defaultImg.user}
                title={usercache.getIn([uuid, 'nickname']) || usercache.getIn([uuid, 'username'])}
                content={usercache.getIn([uuid, 'sign'])}
                time=""
                uuid=""
                isSelected={false}
                onClick={() => this.props.dispatch(showProfileCard(uuid))}
                hideCloseBtn={true}
              />
            )
          }) : (
            <div className="no-friend">暂无好友哦</div>
          )
        }
      </div>
    )
  }

  render() {
    return (
      <div className="converse">
        <div className="list">
          <TabsController>
            <Tab
              name={(
                <span><i className="iconfont">&#xe769;</i>消息</span>
              )}
            >
              {this.getConverseList()}
            </Tab>
            <Tab
              name={(
                <span><i className="iconfont">&#xe60d;</i>好友</span>
              )}
            >
              {this.getFriendList()}
            </Tab>
          </TabsController>
        </div>
        <div className="detail">
          {
            this.props.selectedUUID
            ? (
              <ConverseDetail converseUUID={this.props.selectedUUID}/>
            )
            : (
              <div className="nocontent">
                <p className="nocontent-img"><img src="/src/assets/img/dice.png" /></p>
                <p className="welcome">{this.getWelcomeMessage()}</p>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selectedUUID: state.getIn(['chat', 'selectedConversesUUID']),
    conversesDesc: state.getIn(['chat', 'conversesDesc']),
    converses: state.getIn(['chat', 'converses']),
    friends: state.getIn(['user', 'friendList']),
    usercache: state.getIn(['cache', 'user']),
    userinfo: state.getIn(['user', 'info']),
  })
)(ConverseList);
