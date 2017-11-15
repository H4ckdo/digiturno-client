import PopUp from './PopUp.jsx';
import Form from './Form.jsx';
import FormUpdate from './FormUpdate.jsx';
import Button from './Button.jsx';
import React from 'react';
import $ from 'jquery';
import { epsName, capitalize, validInteger } from '../utils';
const writtenNumber = require('written-number');
const accounting = require("accounting");
import '../../scss/components/Contrato.scss';
import moment from 'moment';

const currencyOptions = {
  symbol : "$",
  decimal : ",",
  thousand: ".",
  precision : 0,
  format: "%s%v"
}

export default class Contrato extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    this.state = {};
  }//end constructor

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
  }//end componentDidMount

  openPopUpEPS() {
    this.childrens.popUpEPS.modal.openPopUp()
  }//end openPopUpEPS

  remove(id) {
    this.setState({itemId: id});
    this.childrens.popUpConfirm.openPopUp();
  }//end remove

  update(self) {
    this.setState({contractId: self.id});
    let populateData = this.childrens.FormUpdate.populateData(self);
    this.childrens.popUpUpdateEPS.openPopUp();
  }//end update

  confirmRemove() {
    this.props.requestRemove(this.state.itemId);
  }//end confirmRemove

  clearFormCreateEPS() {
    this.childrens.FormCreate.childrens.contractValue.setValid("");
    this.childrens.FormCreate.childrens.alertValue.setValid("");
    this.childrens.FormCreate.childrens.name.setValid("");
  }//end clearFormCreateEPS

  render() {
    return (
      <div className="row columns large-10">
        <div className="columns large-4 wrap-btn-add">
          <h1>LISTADO DE EPS</h1>
          <Button onClick={this.openPopUpEPS.bind(this)} type="button" style="btn-add" icon={<i className="material-icons">&#xE146;</i>} data="AGREGAR EPS" />
        </div>

        <table>
          <thead>
            <tr>
              <th width="200">
                <i className="material-icons">&#xE85E;</i>
                <span>Nombre</span>
              </th>
              <th width="350">
                <i className="material-icons">&#xE227;</i>
                <span>Valor del contrato</span>
              </th>
              <th width="300">
                <i className="material-icons">&#xE25C;</i>
                <span>Valor de alerta</span>
              </th>
              <th width="300">
                <i className="material-icons">&#xE227;</i>
                <span>Saldo disponible</span>
              </th>
              <th width="300">
                <i className="material-icons">&#xE916;</i>
                <span>Fecha de registro</span>
              </th>
              <th width="25">Editar</th>
              <th width="25">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.dataList.map((element, index) => {
                return (
                  <tr key={ index } className={ element.availableMoney < element.alertValue ? "alert" : "" }>
                    <td>{ element.name }</td>
                    <td>
                      {
                        `${accounting.formatMoney(element.contractValue, currencyOptions)} (${capitalize(writtenNumber(element.contractValue, { lang: 'es' }))})`
                      }
                    </td>
                    <td>
                      {
                       `${accounting.formatMoney(element.alertValue, currencyOptions)} (${capitalize(writtenNumber(element.alertValue, { lang: 'es' }))})`
                      }
                    </td>
                    <td>
                      {
                       `${accounting.formatMoney(element.availableMoney, currencyOptions)} (${capitalize(writtenNumber(element.availableMoney, { lang: 'es' }))})`
                      }
                    </td>
                    <td>{moment(element.createdAt).format("YYYY-MM-DD")}</td>
                    <td><i onClick={this.update.bind(this, element)} className="pointer material-icons">&#xE22B;</i></td>
                    <td><i onClick={this.remove.bind(this, element.id)} className="pointer material-icons">&#xE872;</i></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        <PopUp
          lift={ this.addChildren.bind(this, "popUpConfirm") }
          id="popUpConfirm"
          animation={ "rebound" }
          full={ true }
          type="confirm"
          onConfirm={ this.confirmRemove.bind(this) }
        />

        <PopUp
          lift={ this.addChildren.bind(this, "popUpUpdateEPS") }
          id="popUpUpdateEPS"
          animation={ "rebound" }
          full={ true }
          type="custom"
          data={
            <div className="columns large-12 large-centered">
              <FormUpdate 
                onSubmit={ this.props.requestUpdate.bind(this, this.state.contractId) } 
                id="FormUpdate" 
                lift={ this.addChildren.bind(this, "FormUpdate") } 
                data={ this.state } 
              />
            </div>
          }
        />

        <PopUp
          lift={ this.addChildren.bind(this, "popUpEPS") }
          id="createEPS"
          animation={ "rebound" }
          full={ true }
          type="custom"
          beforeClose={ this.clearFormCreateEPS.bind(this)}
          data={
            <div className="columns large-12 large-centered">
              <Form submitText={ "CREAR" } onSubmit={ this.props.requestCreate } lift={this.addChildren.bind(this, "FormCreate")} title="AGREGAR EPS" id="FormCreate" data={
                [
                  {
                    title: "Nombre",
                    name: "name",
                    regex: epsName,
                    icon: <i className="material-icons field-icon">&#xE851;</i>,
                    instructions: "Completa este campo sin espacios ni y sin simbolos, minimo 2 caracteres maximo 40"
                  },
                  {
                    title: "Valor del contrato",
                    name: "contractValue",
                    regex: (value) => {
                      let isValid = validInteger(value);
                      let alertValue = Number(this.childrens.FormCreate.childrens.alertValue.state.value || 0);
                      if(isValid && (Number(value) > Number(alertValue))) {
                        this.childrens.FormCreate.childrens.alertValue.setValid(alertValue);
                        return true;
                      } else {
                        return false;
                      }
                    },
                    validMessage: (value) => {
                      return `${accounting.formatMoney(value, currencyOptions)} (${capitalize(writtenNumber(value, { lang: 'es' }))})`
                    },
                    errorMessage:"Escribe un numero entero sin simbolos ni espacios, debe ser ser mayor que el valor de alerta.",
                    icon: <i className="material-icons field-icon">&#xE227;</i>,
                    instructions: "Escribe un numero entero sin simbolos ni espacios, debe ser ser mayor que el valor de alerta."
                  },
                  {
                    title: "Valor de Alerta",
                    name: "alertValue",
                    regex: (value) => {
                      let isValid = validInteger(value);
                      let contractValue = Number(this.childrens.FormCreate.childrens.contractValue.state.value || 0);
                      if(isValid && (Number(value) < Number(contractValue))) {
                        this.childrens.FormCreate.childrens.contractValue.setValid(contractValue);
                        return true;
                      } else {
                        return false;
                      }
                    },
                    validMessage: (value) => {
                      return `${accounting.formatMoney(value, currencyOptions)} (${capitalize(writtenNumber(value, { lang: 'es' }))})`
                    },
                    errorMessage: "Escribe un numero entero sin simbolos ni espacios, debe ser menor que el valor del contrato.",
                    icon: <i className="material-icons field-icon">&#xE25C;</i>,
                    instructions: "Escribe un numero entero sin simbolos ni espacios, debe ser menor que el valor del contrato."
                  }
                ]
              }/>
            </div>
          }
        />
      </div>
    )
  }
}
