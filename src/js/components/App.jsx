//@ sourceMappingUR=/assets/js/modulo.bundle.js.map

import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { fetchData, create, removeData, updateData } from '../actions/epsActions.js';
import { dispatchToken } from '../actions/tokenActions.js';
import { store } from '../stores/epsStore.js';
import PopUp from './PopUp.jsx';
import Form from './Form.jsx';
import Button from './Button.jsx';
import Header from './Header.jsx';
import Contrato from './Contrato.jsx';
import Turno from './Turno.jsx';
import Modulo from './Modulo.jsx';
import { validWord } from '../utils';
import '../../scss/components/App.scss';
import Grafica from './Grafica.jsx';


/**
 * mapStateToProps function, return the data property of the state
 * @params {Object} state - states of the component
 * @returns {Object}
 */

const mapStateToProps = (state) => {
  return {
    EPS: state.EPS.data,
    Token: state.Token.data,
    Modulo: state.Modulo.data
  }
}//end mapStateToProps

/**
* Represent App componnent class
* @constructor
* @param {Object} props - properties inherited of React.Component
*/
export default @connect(mapStateToProps) class App extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
  }//end constructor

  componentDidMount() {
    this.SADDRESS = window.SADDRESS;
    let Modulo = localStorage.getItem("Modulo");
    if(Modulo) {
      this.requestData();
    } else {
      this.childrens.PopUpCreateModulo.openPopUp();
    }

    modulosSocket.on("disconnect", (data) => {
      console.log('disconnect', data);
      if(data.error) {
        this.childrens.errorDisconnectPopUp.openPopUp();
      } else {
        this.childrens.disconnectPopUp.openPopUp();
      }
    })

  }//end componentDidMount

  async requestCreateModulo(data) {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      let response = await create(`http://${this.SADDRESS}:1337/modulo/create`, data, this.childrens);
      this.props.dispatch(response);
      let Modulo = localStorage.getItem("Modulo");
      if(Modulo) {
        this.requestData();
      }
    } catch (e) {
      this.props.dispatch(e);
    }
  }//end requestCreateModulo

  async fetchEps() {
    let responseEPS = await fetchData(`http://${this.SADDRESS}:1337/EPS/showAll`, this.childrens);
    this.props.dispatch(responseEPS);
    return responseEPS;
  }//end fetchEps

  async fetchModulo() {
    let responseModulo = await fetchData(`http://${this.SADDRESS}:1337/modulo/showAll`, this.childrens);
    this.props.dispatch(responseModulo);
    window.moduloList = responseModulo.payload.data;
  }//end fetchModulo

  async requestData() {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      this.joinRoom();
      this.joinEPS();
      this.fetchEps();
      this.fetchModulo();
    } catch (e) {
      console.log('e', e);
      this.props.dispatch(e);
    }
  }//end requestData

  selectGrafica(graficaId, tabSelected) {
    if (tabSelected === graficaId) this.childrens.grafica.requestData(this.SADDRESS);
    if (tabSelected === 'section_contratos') {
      this.props.dispatch({ type: "LOADER", modals: this.childrens });
      this.fetchEps();
    }
    if (tabSelected === 'section_modulos') {
      this.props.dispatch({ type: "LOADER", modals: this.childrens });
      this.fetchModulo();
    }
  }//end selectGrafica

  async requestCreate(data = {}) {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      let response = await create(`http://${this.SADDRESS}:1337/EPS/create`, data, this.childrens);
      this.props.dispatch(response);
    } catch (e) {
      this.props.dispatch(e);
    }
  }//end requestCreate

  renderDataList() {
    return this.props.EPS.map((element, index) => {
      return (
        <li key={ index }>{ element.name }</li>
      )
    })
  }//end renderUserList

  async requestUpdate(id, data) {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      let response = await updateData(`http://${this.SADDRESS}:1337/EPS/update/${id}`, id, this.childrens, data);
      this.props.dispatch(response);
      //update at eps:update event
    } catch (e) {
      this.props.dispatch(e);
    }
  }//end requestUpdate

  findModulo() {

  }//end findModulo

  async requestCancelToken(id, data) {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      let response = await dispatchToken(`http://${this.SADDRESS}:1337/token/update/${ id }`, id, this.childrens, data);
      this.props.dispatch(response);
    } catch (e) {
      console.log('e', e);
      this.props.dispatch(e);
    }
  }//end requestCancelToken

  async requestCallUser(self, bnts) {
    let turno = this.childrens.turno;
    let requestTV = new Promise((resolve, reject) => {
      modulosSocket.post(`http://${this.SADDRESS}:1337/token/showInTV`, {id: self.id, dispatchedBy: self.dispatchedBy} ,(room, jwres) => {
        if(jwres.statusCode === 200) return resolve();
        reject({type: "UNEXPECTED_RESPONSE", modals: this.childrens});
      })
    })
    try {
      let result = await requestTV;
    } catch(e) {
      console.log('e', e);
      this.props.dispatch(e);
    }
  }//end requestCallUser

  async requestUpdateDispatched(id, data, turno) {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      let response = await dispatchToken(`http://${this.SADDRESS}:1337/token/update/${ id }`, id, this.childrens, { dispached: true });
      this.props.dispatch(response);
    } catch (e) {
      console.log('e', e);
      this.props.dispatch(e);
    }
  }//end requestUpdateDispatched

  async requestRemove(id) {
    this.props.dispatch({type: "LOADER", modals: this.childrens});
    try {
      let response = await removeData(`http://${this.SADDRESS}:1337/EPS/delete/${id}`,id, this.childrens);
      this.props.dispatch(response);
    } catch (e) {
      this.props.dispatch(e);
    }
  }//end requestRemove

  notifyMe(title = " ", extra = {}) {
    let options = {
      icon: "../../../assets/images/notification_logo.png",
      body: "Cierra o pulsa la notificación"
    }

    if(extra.delay === 0) return;

    if(localStorage.getItem("notification") === "true") {
      window.notification = new Notification(title, {...options, extra});
      let soundAlert = localStorage.getItem("soundAlert");
      if(soundAlert === "true" || soundAlert === null) {
        let sound = new Audio("../../../assets/audio/notification.mp3");
        sound.play();
      }

      notification.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        notification.close();
      }
      let delay = extra.delay || 2000
      setTimeout(notification.close.bind(notification),  Number(delay));
    }

  }//end notifyMe

  async joinEPS() {
    let requestJoin =  new Promise((resolve, reject) => {
      modulosSocket.get(`http://${this.SADDRESS}:1337/EPS/join`, (room, jwres) => {
        console.log('jwres', jwres);
        if (jwres.statusCode === 200) return resolve();
        reject({ type: "UNEXPECTED_RESPONSE", modals: this.childrens })
      })
    })
    try {
      let action = await requestJoin;      
      modulosSocket.on("eps:update", (event) => {
        console.log("event ", event)
        this.props.dispatch({
          payload: event,
          status:[200],
          type:"UPDATE_DATA",
          modals: this.childrens
        });
      })
      /*
      */
    } catch (e) {
      this.props.dispatch(e);
    }   
  }//end joinEPS

  async joinRoom() {
    let moduloId = localStorage.getItem("Modulo");
    let requestJoin = new Promise((resolve, reject) => {
      modulosSocket.get(`http://${this.SADDRESS}:1337/token/stack?moduloId=${moduloId}`, (room, jwres) => {
        if(jwres.statusCode === 200) return resolve();
        console.log('jwres', jwres);
        reject({type: "UNEXPECTED_RESPONSE", modals: this.childrens})
      })
    })

    try {
      let action = await requestJoin;
      modulosSocket.on("token:created", (event) => {
        this.props.dispatch({type: "PAINT_TOKEN", name: event.name, id: event.id});
        this.notifyMe(`Nuevo turno: ${ event.name }`);
      })

    } catch(e) {
      this.props.dispatch(e);
    }
  }//end joinRoom

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  resolveModuloPopUp() {
    let Modulo = localStorage.getItem("Modulo");
    if(Modulo === null) {
      this.childrens.PopUpCreateModulo.openPopUp();
    }
  }//end resolveModuloPopUp

  whantNotification() {
    localStorage.setItem("notification", true)
    this.notifyMe("Notificaciones activadas", {delay: 0});
  }//end whantNotification

  removeNotification() {
    localStorage.setItem("notification", false)
    window.notification.close();
  }//end whantNotification

  whantNotificationSound() {
    localStorage.setItem("soundAlert", true)
  }//end whantNotificationSound

  removeNotificationSound() {
    localStorage.setItem("soundAlert", false)
  }//end removeNotificationSound

  closeApp() {
    window.location.reload();
  }//end closeApp

  render() {
    return (
      <div>
        <Header onSelect={ this.selectGrafica.bind(this, "section_grafica") } />

        <div id="wrap-tabs-panels">
          <section className="tabs-panel" id="section_turno">
            <Turno 
              lift={ this.addChildren.bind(this, "turno") } 
              requestCallUser={ this.requestCallUser.bind(this) } 
              requestCancelToken={ this.requestCancelToken.bind(this) } 
              requestUpdateDispatched={ this.requestUpdateDispatched.bind(this) } removeNotificationSound={ this.removeNotificationSound.bind(this) }  whantNotificationSound={ this.whantNotificationSound.bind(this) } removeNotification={ this.removeNotification.bind(this) } 
              whantNotification={ this.whantNotification.bind(this) } 
              tokens={ this.props.Token } 
              watch={ this.joinRoom.bind(this) }  
            />
          </section>

          <section className="tabs-panel hide" id="section_contratos">
            <Contrato 
              requestRemove={ this.requestRemove.bind(this) } 
              requestUpdate={ this.requestUpdate.bind(this) } 
              requestCreate={ this.requestCreate.bind(this) }
              dataList={ this.props.EPS } 
              lift={ this.addChildren.bind(this, "contrato") } 
            />
          </section>

           <section className="tabs-panel hide" id="section_modulos">
              <Modulo data={ this.props.Modulo }/>
          </section>


          <section className="tabs-panel hide" id="section_grafica">
              <Grafica data={ this.props.Modulo } lift={ this.addChildren.bind(this, "grafica") } />
          </section>

        </div>

        <PopUp
          lift={ this.addChildren.bind(this, "PopUpCreateModulo") }
          id="PopUpCreateModulo"
          animation={ "rebound" }
          full={ true }
          type="custom"
          noX={ true }
          data={
            <div className="columns large-12 large-centered">
              <Form submitText={ "REGISTRAR" } onSubmit={this.requestCreateModulo.bind(this)} lift={this.addChildren.bind(this, "FormCreateModulo")} title="REGISTRAR MODULO" id="FormCreateModulo" data={
                [
                  {
                    title: "Nombre",
                    name: "name",
                    id: "eps-name",
                    defaultValue: "",
                    regex: validWord,
                    icon: <i className="material-icons field-icon">&#xE851;</i>,
                    instructions: "Completa este campo sin espacios ni simbolos, minimo 3 caracteres maximo 10"
                  }
                ]
              }/>
            </div>
          }
        />

        <PopUp
          lift={ this.addChildren.bind(this, "loader") }
          id="loaderPopUp"
          animation={ "rebound" }
          full={ false }
          type="load"
        />

        <PopUp
          lift={ this.addChildren.bind(this, "fail") }
          id="failPopUp"
          animation={ "rebound" }
          full={ false }
          type="error"
        />

        <PopUp
          lift={ this.addChildren.bind(this, "errorDisconnectPopUp") }
          id="errorDisconnectPopUp"
          animation={ "rebound" }
          full={ false }
          type="error"
        />

        <PopUp
          lift={ this.addChildren.bind(this, "disconnectPopUp") }
          id="disconnectPopUp"
          animation={ "rebound" }
          full={ false }
          type="warning"
          afterClose={ this.closeApp.bind(this) }
          textButton="Reconectar"
          message="El pack esta desconectado, intenta reiniciar lo, una vez el pack este conectado haz click sobre el boton: Reconectar"
        />


        <PopUp
          lift={ this.addChildren.bind(this, "conflicPopUp") }
          id="conflicPopUp"
          animation={ "rebound" }
          full={ false }
          type="warning"
          message="Ya existe un recurso con este mismo nombre, por favor intentalo de nuevo con un nombre distinto."
        />

      </div>
    )
  }//end render
}
