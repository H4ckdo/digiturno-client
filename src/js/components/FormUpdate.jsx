import React from 'react';
import $ from 'jquery';
import '../../scss/components/Form.scss';
import '../../scss/components/FormUpdate.scss';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { validWord, epsName, validInteger, capitalize } from '../utils';
const writtenNumber = require('written-number');
const accounting = require("accounting");

const currencyOptions = {
  symbol : "$",
  decimal : ",",
  thousand: ".",
  precision : 0,
  format: "%s%v"
}

export default class FormUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    this.state = {};
  }//end constructor

  populateData(self) {
    let name = this.childrens.name;
    let lessValue = self.moneyLess || 0;
    let contractValue = this.childrens.contractValue;
    let alertValue = this.childrens.alertValue;
    let moneyLess = this.childrens.moneyLess;
    let moneyAdd = this.childrens.moneyAdd;

    name.bindValue(name)({
      target: { value: self.name }
    })

    contractValue.bindValue(contractValue)({
      target: { value: self.contractValue }
    })

    alertValue.bindValue(alertValue)({
      target: { value: self.alertValue }
    })

    moneyLess.bindValue(moneyLess)({
      target: { value: String(lessValue) }
    })

    moneyAdd.bindValue(moneyAdd)({
      target: { value: "0" }
    })

    this.setState({
      availableMoney: self.availableMoney,
      justOpen: true
    })
  }//end populateData

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
    if(this.props.onMount) this.props.onMount(this);
  }//end componentDidMount

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  validateName(value) {
    return epsName(value);
  }//end validateName

  validateContractValue(value) {
    let alertValue = this.childrens.alertValue.state.value;
    let isValid = validInteger(String(value));
    if(isValid && Number(alertValue) < Number(value)) {
      this.childrens.alertValue.setValid(String(alertValue))
    }
    return (isValid && (Number(value) > Number(alertValue)) )
  }//end validateContractValue

  validateContractAlert(value) {
    let contractValue = this.childrens.contractValue.state.value;
    let isValid = validInteger(String(value));
    if(isValid && Number(contractValue) > Number(value)) {
      this.childrens.contractValue.setValid(contractValue);
      this.setState({justOpen: false});
    }
    return (isValid && Number(value) < Number(contractValue))
  }//end validateContractAlert

  validateMoneyLess(value) {
    let availableMoney = this.state.availableMoney;
    let isValid = validInteger(String(value));
    return (isValid && Number(value) < Number(availableMoney));
  }//end validateMoneyLess

  updateValues(self, value) {
    let moneyLess = this.childrens.moneyLess;
    let availableMoney = this.state.availableMoney;
    if(moneyLess) {
      let calc = (Number(value) + Number(availableMoney)) - Number(moneyLess.state.value);
      //if(this.state.justOpen) return;
      //this.setState({availableMoney: calc});
    }
  }//end updateValues

  updateCurrentMoney(self, value) {
    let availableMoney = this.state.availableMoney;
    let moneyLess = this.childrens.moneyLess;
    if(availableMoney) {
      let calc = Number(availableMoney) - Number(moneyLess.state.value);
      this.setState({availableMoney: calc});
      this.childrens.moneyLess.setValid("0");
    }
  }//end updateCurrentMoney

  disableCalc(btnName) {
    console.log('btnName', btnName);
    let btnCalc = this.childrens[btnName];
    if(btnCalc) btnCalc.setState({disabled: true});
  }//end disableCalc

  enableCalc(btnName) {
    let btnCalc = this.childrens[btnName];
    if(btnCalc) btnCalc.setState({disabled: false});
  }//end enableCalc

  validMessage(value) {
    return `${accounting.formatMoney(value, currencyOptions)} (${capitalize(writtenNumber(value, { lang: 'es' }))})`
  }//end validMessage

  goodName() {
    return " "
  }//end goodName

  trySubmit() {

  }//end trySubmit

  updateAvailableMoney() {
    let availableMoney = Number(this.state.availableMoney) + Number(this.childrens.moneyAdd.state.value)
    this.setState({availableMoney})
    this.childrens.moneyAdd.setValid("0");
  }//end updateAvailableMoney

  validateAddMoney(value) {
    return validInteger(value);
  }//end validateAddMoney

  templateCreate() {
    let integerMessage = "Escribe un numero entero sin simbolos ni espacios";

    return (
      <div className="row">
        <div className="columns">
          <h1 className="form-title">
            <i className="material-icons">&#xE85D;</i>
            <span>ACTUALIZAR EPS</span>
          </h1>

          <div className="wrap-field-valid">
            <i className="material-icons field-icon">&#xE851;</i>
            <span className="field-title">Nombre</span>
            <Input errorMessage="Completa este campo sin simbolos, minimo 2 caracteres maximo 40" pattern={ this.validateName.bind(this) } autoComplete={ false } id="eps-name" validMessage={ this.goodName.bind(this) } defaultValue={ this.state.name } lift={ this.addChildren.bind(this, "name") } defaultMessage={ "Completa este campo sin simbolos, minimo 2 caracteres maximo 40" } name={ "name" } title={ "Completa este campo sin simbolos, minimo 2 caracteres maximo 40" } placeholder="Completa este campo" type="text"/>
          </div>

          <div className="wrap-field-valid">
            <i className="material-icons field-icon">&#xE227;</i>
            <span className="field-title">Valor del contrato</span>
            <Input errorMessage="Debes llenar este campo con un numero entero, sin simbolos ni espacios, maximo 24 cifras y debe ser mayor al valor de alerta" onValid={ this.updateValues.bind(this) } pattern={ this.validateContractValue.bind(this) } autoComplete={ false } id="eps-contract-value" validMessage={ this.validMessage.bind(this) } lift={ this.addChildren.bind(this, "contractValue") } defaultMessage={ integerMessage } name={ "contractValue" } title={ integerMessage } placeholder="Completa este campo" type="text"/>
          </div>

          <div className="wrap-field-valid">
            <i className="material-icons field-icon">&#xE25C;</i>
            <span className="field-title">Valor de alerta</span>
            <Input errorMessage="Debes llenar este campo con un numero entero, sin simbolos ni espacios, maximo 24 cifras y debe ser menor al valor del contrato" pattern={ this.validateContractAlert.bind(this) } autoComplete={ false } id="eps-contract-alert" lift={ this.addChildren.bind(this, "alertValue") } validMessage={ this.validMessage.bind(this) }  defaultMessage={ integerMessage } name={ "alertValue" } title={ integerMessage } placeholder="Completa este campo" type="text"/>
          </div>

          <div className="wrap-field-valid">
            <i className="material-icons field-icon">attach_money</i>
            <span className="field-title">Valor a restar</span>
            <div className="row wrap-calc-money">
              <div className="columns large-10">
                <Input errorMessage="Debes llenar este campo con un numero entero, sin simbolos ni espacios, maximo 24 cifras y debe ser menor al saldo disponible" whenEmpty={ this.disableCalc.bind(this, "btnCalc") } onInvalid={ this.disableCalc.bind(this, "btnCalc") } onValid={ this.enableCalc.bind(this, "btnCalc")  } pattern={ this.validateMoneyLess.bind(this) } validMessage={ this.validMessage.bind(this) }  autoComplete={ false } id="eps-less-money" lift={ this.addChildren.bind(this, "moneyLess") } defaultMessage={ integerMessage } name={ "moneyLess" } title={ integerMessage } placeholder="Completa este campo" type="text"/>
              </div>
              <div className="columns large-2">
                <Button style="btn-custom" lift={ this.addChildren.bind(this, "btnCalc") } onClick={ this.updateCurrentMoney.bind(this) } icon={ <i className="material-icons">remove</i> } type="button" />
              </div>
            </div>
          </div>

          <div className="wrap-field-valid">
            <i className="material-icons field-icon">attach_money</i>
            <span className="field-title">Añadir al saldo disponible</span>
            <div className="row wrap-calc-money">
              <div className="columns large-10">
                <Input errorMessage="Debes llenar este campo con un numero entero, sin simbolos ni espacios, maximo 24 cifras y debe ser menor al saldo disponible" whenEmpty={ this.disableCalc.bind(this, "btnAdd") } onInvalid={ this.disableCalc.bind(this, "btnAdd") } onValid={ this.enableCalc.bind(this, "btnAdd")  } pattern={ this.validateAddMoney.bind(this) } validMessage={ this.validMessage.bind(this) }  autoComplete={ false } id="eps-add-money" lift={ this.addChildren.bind(this, "moneyAdd") } defaultMessage={ integerMessage } name={ "moneyAdd" } title={ integerMessage } placeholder="Completa este campo" type="text"/>
              </div>
              <div className="columns large-2">
                <Button style="btn-custom" lift={ this.addChildren.bind(this, "btnAdd") } onClick={ this.updateAvailableMoney.bind(this) } icon={ <i className="material-icons">add</i> } type="button" />
              </div>
            </div>
          </div>

          <div className="wrap-field-valid">
            <i className="material-icons field-icon">attach_money</i>
            <span className="field-title">Salgo disponible</span>
            <p>{ this.validMessage(this.state.availableMoney) }</p>
          </div>

          <Button style="btn-confirm" data="ACTUALIZAR" type="submit" />
        </div>
      </div>
    )
  }//end templateCreate

  mapChildrens(childrens = {}) {
    let result = {};
    Object.keys(childrens).map(child => {
      let { state, props } = this.childrens[child];
      result[props.name] = state.value;
    })
    return result;
  }//end mapChildrens

  allValid(e) {
    e.preventDefault();
    let childrens = this.childrens;
    let validName = childrens.name.state.valid;
    let validContract = childrens.contractValue.state.valid;
    let validContractAlert = childrens.alertValue.state.valid;
    let validAvailableMoney = this.state.availableMoney;
    let validMoneyLess = childrens.moneyLess.state.valid;

    if(validName && validContract && validContractAlert && validAvailableMoney && validMoneyLess) {
      document.getElementById(this.props.id).reset();
      childrens.name.setState({valid: false, value:""});
      childrens.contractValue.setState({valid: false, value:""});
      childrens.alertValue.setState({valid: false, value:""});
      childrens.moneyLess.setState({valid: false, value:"0"});
      let dataSubmit = this.mapChildrens({
        alertValue: childrens.alertValue,
        contractValue: childrens.contractValue,
        name: childrens.name
      })
      dataSubmit.availableMoney = this.state.availableMoney;
      this.setState({justOpen: false});
      return this.props.onSubmit(dataSubmit);
    } else {
      console.log("invalidos")
    }
  }//end allValid

  render() {
    return (
      <form className="wrap-form" id={ this.props.id } onSubmit={ this.allValid.bind(this) } >
        { this.templateCreate.bind(this)() }
      </form>
    )
  }//end render
}
