import React from 'react';
import $ from 'jquery';
import '../../scss/components/Form.scss';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { validWord } from '../utils';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.childrens = {};
  }//end constructor

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
    if(this.props.onMount) this.props.onMount(this);
  }//end componentDidMount


  callSiblings(sendBy, sendTo, data) {
    let sibling = this.childrens[sendTo]
    sibling.setData.bind(sibling, 'shift', data);
  }//end callSiblings

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  templateCreate() {
    return (
      <div className="row">
        <div className="columns">
          <h1 className="form-title">
            <i className="material-icons">&#xE85D;</i>
            <span>{ this.props.title || " " }</span>
          </h1>
          {
            this.props.data.map((elements, index) => {
              return (
                <div key={ index }>
                  { elements.icon }
                  <span className="field-title">{ elements.title }</span>
                  <Input errorMessage={ elements.errorMessage } whenValid={ elements.whenValid } autoComplete={false} id={elements.id || ""} defaultValue={elements.defaultValue || ""} lift={ this.addChildren.bind(this, elements.name) } validMessage={elements.validMessage || null} defaultMessage={elements.instructions || " "} name={elements.name} title={elements.instructions || "" } placeholder="Completa este campo" type={elements.type || "text"} pattern={ elements.regex ? elements.regex.bind(this) : function() { } }/>
                </div>
              )
            })
          }
          <Button onSubmit={ this.props.onSubmit.bind(this) } style="btn-confirm" data={this.props.submitText || "Enviar"} type="submit" />
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
    let validForm = Object.keys(this.childrens).every(child => this.childrens[child].state.valid);
    if(validForm) {
      document.getElementById(this.props.id).reset();
      Object.keys(this.childrens).forEach(child => {
        this.childrens[child].setState({valid: false, value: ""})
      })
      return this.props.onSubmit(this.mapChildrens(this.childrens));
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
