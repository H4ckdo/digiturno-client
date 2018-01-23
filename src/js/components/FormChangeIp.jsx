import React from 'react';
import Input from './Input.jsx';
import Button from './Button.jsx';
import '../../scss/components/FormChangeIp.scss';

export default class FormChangeIp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let icon = this.props.type === 'error' ? 'error_outline' : 'settings';
    return (
      <div className="wrap-popup-info form-change-ip">
        <div className="wrap-popup-title">
          <i className={`material-icons ${this.props.type === 'error' ? 'error-icon' : 'warning-icon'} `}>
            {icon}
          </i>

          <h1 className={`${this.props.type === 'error' ? 'title-error' : 'warning-title'}`}>{this.props.title}</h1>
          <span>{this.props.ipMessage}</span>
        </div>

        <div className="row wrap-input">
          <div className="columns large-11">
            <Input
              ref="input-ip"
              pattern={
                (candidate) => {
                  if (this.props.foolValidator) return true;

                  const test = /(192)\.(168)(\.([2][0-5][0-5]|[1][0-9][0-9]|[1-9][0-9]|[0-9])){2}/g.exec(candidate)
                  if (test && test[0].length === candidate.length) return true;
                  return false;
                }
              }
              placeholder={this.props.placeholder}
              defaultMessage={"Completa este campo correctamente."}
            />
          </div>
          <div className="columns large-1">
            <Button style="btn-send" onClick={this.props.onUpdate.bind(this, this.refs['input-ip'])} />
          </div>

        </div>
      </div>
    )
  }
}
