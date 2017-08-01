import PopUp from './PopUp.jsx';
import Form from './Form.jsx';
import Button from './Button.jsx';
import Token from './Token.jsx';
import React from 'react';
import $ from 'jquery';
import { capitalize } from '../utils';
import '../../scss/components/Turno.scss';

import moment from 'moment';

export default class Turno extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    let notificationCheck, notificationSound;

    if(localStorage.getItem("notification") === null) {
      localStorage.setItem("notification", true);
      notificationCheck = true;
    } else {
      notificationCheck = localStorage.getItem("notification") === "true" ? true : false;
    }

    if(localStorage.getItem("soundAlert") === null) {
      localStorage.setItem("soundAlert", true);
      notificationSound = true;
    } else {
      notificationSound = localStorage.getItem("soundAlert") === "true" ? true : false;
    }

    this.state = {
      notificationCheck,
      notificationSound
    }
  }//end constructor

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
  }//end componentDidMount

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  dispatchToken(self) {
    this.props.requestUpdateDispatched(self.props.id, { dispatched: true, dispatchAt: new Date() }, self);
    self.childrens.despachar.setState({disabled: true});
  }//end dispatchToken

  callUser(self) {
    self.childrens.despachar.setState({disabled: false});
    let dispatchedBy = localStorage.getItem("Modulo");
    this.props.requestCallUser({ dispatchedBy, id: self.props.id }, self.childrens);
  }//end callUser

  cancelToken(self) {
    this.props.requestCancelToken(self.props.id, { canceled: true, canceledAt: new Date() });
  }//end cancelToken

  toogleNotification() {
    let notification = this.state.notificationCheck;
    this.setState({notificationCheck: !notification});
    if(this.state.notificationCheck === false && !!this.props.whantNotification) this.props.whantNotification();
    if(this.state.notificationCheck === true && !!this.props.removeNotification) this.props.removeNotification();

    localStorage.setItem("notification", !notification)
  }//end toogleNotification

  toogleNotificationSound() {
    let sound = this.state.notificationSound;
    if(sound === true) {
      this.setState({notificationSound: false});
      if(this.props.removeNotificationSound) this.props.removeNotificationSound();

    } else {
      this.setState({notificationSound: true});
      if(this.props.whantNotificationSound) this.props.whantNotificationSound();
    }
  }//end toogleNotificationSound

  render() {
    let notificationCheck = Boolean(this.state.notificationCheck);
    let notificationSound = Boolean(this.state.notificationSound)
    return (
      <div className="row columns large-10">
        <h1 className="turno-title">TURNOS EN ESPERA</h1>
        <div className="wrap-notification-request">
          <span>Notificacion</span>
          <span onClick={ this.toogleNotification.bind(this) }>
            <i className={ (notificationCheck === false || notificationCheck === null) ? "hide" : "material-icons notification-active" }>&#xE834;</i>
            <i className={ notificationCheck === false ? "material-icons notification-inactive" : "hide" }>&#xE835;</i>
          </span>
          <span className={ notificationCheck === true ? " " : "hide" } onClick={ this.toogleNotificationSound.bind(this) }>
            <i className={ (notificationSound === true  || notificationSound === null) ? "material-icons notification-sound-on" : "hide" }>&#xE050;</i>
            <i className={ notificationSound === false ? "material-icons notification-sound-off" : "hide" }>&#xE04F;</i>
          </span>

        </div>
        <div className="wrap-turnos">
          <nav>
            <ol>
              {
                this.props.tokens.map((token, index) => {
                  return (
                    <li key={ index } className={ index === 0 ? "" : "disable-token"}>
                      <Token id={ token.id } lift={ this.addChildren.bind(this, token.name) } name={ token.name } onCancel={ this.cancelToken.bind(this) } onCall={ this.callUser.bind(this) } onDispatch={ this.dispatchToken.bind(this) }/>
                    </li>
                  )
                })
              }

            </ol>
          </nav>

        </div>
      </div>
    )
  }
}
