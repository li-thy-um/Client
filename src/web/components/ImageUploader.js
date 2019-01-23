const React = require('react');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const fileUrl = require('../../api/trpg.api.js').fileUrl;
const { showAlert } = require('../../redux/actions/ui');
const axios = require('axios');

require('./ImageUploader.scss');

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      uploadProgress: 0,
    };
  }

  _handleSelect() {
    if (this.state.isUploading) {
      this.props.dispatch(showAlert('图片正在上传中, 请稍后...'));
      return;
    }
    this.refs.file.click();
  }

  _handleUpload() {
    let file = this.refs.file.files[0];
    let formData = new FormData();
    formData.append('avatar', file);

    let headers = {
      'avatar-type': this.props.type || 'actor',
      'user-uuid': this.props.user_uuid,
    };
    if (this.props.attachUUID) {
      headers['attach-uuid'] = this.props.attachUUID;
    }
    if (this.props.width) {
      headers.width = this.props.width;
      if (this.props.height) {
        headers.height = this.props.height;
      }
    }
    this.setState({ isUploading: true });

    axios({
      url: fileUrl + '/avatar',
      method: 'post',
      headers,
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          console.log(`进度:${progressEvent.loaded}/${progressEvent.total}`);
          let uploadProgress = (
            (progressEvent.loaded / progressEvent.total) *
            100
          ).toFixed();
          this.setState({ uploadProgress });
        }
      },
    })
      .then((res) => {
        return res.data;
      })
      .then((json) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        if (typeof json === 'object') {
          console.log('上传成功', json);
          if (this.props.onUploadSuccess) {
            this.props.onUploadSuccess(json);
          }
        } else {
          this.props.dispatch(showAlert('图片上传失败:' + json));
          console.error(json);
        }
      })
      .catch((e) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        this.props.dispatch(showAlert('图片上传失败:' + e));
        console.error(e);
      });
  }

  render() {
    return (
      <div
        className="image-uploader"
        style={{
          width: this.props.containerWidth,
          height: this.props.containerHeight,
        }}
        onClick={() => this._handleSelect()}
      >
        <input
          type="file"
          ref="file"
          accept="image/*"
          onChange={(e) => this._handleUpload()}
        />
        <div className={'mask' + (this.state.isUploading ? ' active' : '')}>
          {this.state.isUploading
            ? this.state.uploadProgress
              ? `${this.state.uploadProgress}%`
              : '图片上传中...'
            : '点击上传图片'}
        </div>
        {this.props.children}
      </div>
    );
  }
}

ImageUploader.propTypes = {
  onUploadSuccess: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['actor', 'user', 'group']),
  attachUUID: PropTypes.string,
  containerWidth: PropTypes.string,
  containerHeight: PropTypes.string,
};

module.exports = connect((state) => ({
  user_uuid: state.getIn(['user', 'info', 'uuid']),
}))(ImageUploader);
