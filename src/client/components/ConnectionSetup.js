import React from 'react';
import { connect } from 'react-redux';

import { red900 } from 'material-ui/styles/colors';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import RTorrent from './rTorrent';
import { updateConnectionSettings } from '../actions/connectionSettings';

class ConnectionSetup extends React.Component {
  static propTypes = {
    connectionSettings: React.PropTypes.object.isRequired,
    updateConnectionSettings: React.PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    const { connectionSettings } = args[0];

    this.state = {
      error: false,
      finished: false,
      stepIndex: 0,
      hostname: connectionSettings.hostname,
      port: connectionSettings.port,
      path: connectionSettings.path,
      username: connectionSettings.username,
      password: connectionSettings.password,
    };
  }

  getStepContent(stepIndex) {
    const inputProps = {
      hintStyle: { color: 'rgba(0, 0, 0, 0.298039)' },
      inputStyle: { color: 'black' },
      underlineShow: true,
      floatingLabelFixed: true,
      floatingLabelStyle: { color: 'rgb(0, 151, 167)' },
      style: { width: '100%' },
      underlineStyle: { borderBottomWidth: 2, borderColor: 'rgba(0, 0, 0, 0.298039)' },
      onChange: (event, newValue) => {
        this.setState({
          [event.currentTarget.getAttribute('data-ref')]: newValue,
        });
      },
    };

    switch (stepIndex) {
      case 0:
        return (
          <div>
            <p style={{ display: this.state.error ? 'block' : 'none', color: red900 }}>
              Something went wrong when connecting to rTorrent, please check the connection details and try again
            </p>
            <TextField data-ref="hostname" hintText="http://seedbox.magicalplace.com" defaultValue={this.state.hostname} floatingLabelText="Hostname" {...inputProps} />
            <TextField data-ref="port" hintText="80" defaultValue={this.state.port} floatingLabelText="Port" {...inputProps} />
            <TextField data-ref="path" hintText="/plugins/httprpc/action.php" defaultValue={this.state.path} floatingLabelText="Path to HTTPRPC" {...inputProps} />
            <TextField data-ref="username" hintText="" floatingLabelText="Username" defaultValue={this.state.username} {...inputProps} />
            <TextField data-ref="password" hintText="" floatingLabelText="Password" type="password" defaultValue={this.state.password} {...inputProps} />
          </div>
        );
      case 1:
        return (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={2} />
          </div>
        );
      case 2:
        return (
          <div>
            Our connection is looking good!!
          </div>
        );
      default:
        return 'Sorry! Something broke... Blame the monkeys';
    }
  }

  attemptConnection() {
    const testSettings = {
      host: this.state.hostname,
      port: this.state.port,
      path: this.state.path,
      username: this.state.username,
      password: this.state.password,
    };
    const rtorrent = new RTorrent(testSettings);

    rtorrent.getAll()
      .then(() => {
        this.props.updateConnectionSettings(testSettings);
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line
        this.setState({
          error: true,
          finished: true,
          stepIndex: 0,
        });
      });
  }

  handleNext() {
    const { stepIndex } = this.state;
    if (stepIndex + 1 === 1) {
      this.attemptConnection();
    }
    this.setState({
      finished: false,
      stepIndex: stepIndex + 1,
    });
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        finished: false,
        stepIndex: stepIndex - 1,
      });
    }
  }

  render() {
    const { finished, stepIndex } = this.state;
    const contentStyle = { margin: '0 16px' };

    return (
      <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Enter Connection Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Verify Connection</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          <div>
            {this.getStepContent(stepIndex)}
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <RaisedButton
                label="Back"
                disabled={stepIndex === 0}
                onTouchTap={this.handlePrev.bind(this)}
                style={{ marginRight: 12, display: (stepIndex === 0 || finished ? 'none' : 'inline-block') }}
              />
              <RaisedButton
                label={finished ? 'Get Started!!' : 'Next'}
                disabled={stepIndex === 1 && !finished}
                primary
                onTouchTap={this.handleNext.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connectionSettings: state.connectionSettings,
});

const mapDispatchToProps = (dispatch) => ({
  updateConnectionSettings: (newSettings) => dispatch(updateConnectionSettings(newSettings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionSetup);
