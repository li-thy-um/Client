import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';
import { showLoading } from '../../shared/redux/actions/ui';
import { login, loginWithToken } from '../../shared/redux/actions/user';
import config from '../../shared/project.config';
import rnStorage from '../../shared/api/rn-storage.api';
import './Login.scss';
import { TRPGState } from '@redux/types/__all__';

interface Props extends DispatchProp<any> {
  isLogin: boolean;
  oauthList: string[];
  history: any;
}
class Login extends React.Component<Props> {
  state = {
    username: '',
    password: '',
  };

  onQQConnectFinished = (e: MessageEvent) => {
    let { type, uuid, token } = e.data;
    if (type === 'onOAuthFinished') {
      if (!uuid || !token) {
        console.error('oauth登录失败, 缺少必要参数', uuid, token);
        return;
      }

      // 注册新的uuid与token并刷新
      rnStorage.set('uuid', uuid);
      rnStorage.set('token', token);

      this.props.dispatch(loginWithToken(uuid, token, 'qq'));
    }
  };

  componentDidMount() {
    if (!!this.props.isLogin) {
      this.props.history.push('main');
    } else {
      window.addEventListener('message', this.onQQConnectFinished);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!!nextProps.isLogin) {
      this.props.history.push('main');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onQQConnectFinished);
  }

  handleLogin() {
    this.props.dispatch(showLoading());
    let username = this.state.username;
    let password = this.state.password;
    this.props.dispatch(login(username, password));
  }

  handleQQLogin() {
    console.log('qq登录');
    window.open(
      config.file.url + '/oauth/qq/login',
      'TencentLogin',
      'width=450,height=600'
    );
  }

  render() {
    const canLogin =
      this.state.username &&
      this.state.password &&
      this.state.password.length >= 5;

    return (
      <div className="login-screen">
        <h2>欢迎来到TRPG的世界</h2>
        <input
          type="text"
          placeholder="用户名"
          value={this.state.username}
          onChange={(e) => {
            this.setState({ username: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="密码"
          value={this.state.password}
          onChange={(e) => {
            this.setState({ password: e.target.value });
          }}
          onKeyUp={(e) => e.keyCode === 13 && this.handleLogin()}
        />
        <div className="loginArea">
          <button
            className={canLogin ? 'active' : ''}
            onClick={() => this.handleLogin()}
            disabled={!canLogin}
          >
            登录
          </button>
          {this.props.oauthList.includes('qq') ? (
            <button onClick={() => this.handleQQLogin()}>
              <i className="iconfont">&#xe786;</i>
            </button>
          ) : null}
        </div>
        <Link to="register">没有账号？现在注册</Link>
      </div>
    );
  }
}

function mapStateToProps(state: TRPGState) {
  return {
    isLogin: state.user.isLogin,
    oauthList: state.settings.config.oauth ?? [],
  };
}

export default connect(mapStateToProps)(Login);
