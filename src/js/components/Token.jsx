import Button from './Button.jsx';
import PopUp from './PopUp.jsx';
import React from 'react';

export default class Token extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    this.state = {
      dispatched: false
    }
  }//end constructor

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
  }//end componentDidMount

  disableBtnCall() {
    this.childrens.llamar.setState({disabled: true});
    this.props.onCall.bind(this, this)();
  }//end disableBtnCall

  enableBtnCall(action) {
    this.childrens.llamar.setState({disabled: false});
    this.props[action].bind(this, this)();
  }//end enableBtnCall

  render() {
    return (
      <div className="row large-12 medium-12 small-12">
        <h1 className="turno-name columns large-3 medium-3 small-3">{ this.props.name }</h1>
        <div className="columns large-3  medium-3 small-3 pull-down">
          <Button style="btn-custom" lift={ this.addChildren.bind(this, "llamar") } type="button" onClick={ this.disableBtnCall.bind(this) } icon={<i className="material-icons">&#xE91F;</i>} data="Llamar"/>
        </div>

        <div className="columns large-3 medium-3 small-3 pull-down">
          <Button disabled={ true } type="button" style="btn-confirm" lift={ this.addChildren.bind(this, "despachar") } onClick={ this.enableBtnCall.bind(this, "onDispatch") } data={"Despachar"} />
        </div>

        <div className="columns large-3 medium-3 small-3 pull-down">
          <Button style="btn-cancel" type="button" onClick={ this.enableBtnCall.bind(this, "onCancel") } data="Cancelar"/>
        </div>
      </div>
    )
  }
}//end Token
