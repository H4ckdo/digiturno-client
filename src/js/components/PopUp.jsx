import React from 'react';
import $ from 'jquery';
import Button from '../components/Button.jsx';
import '../../scss/components/PopUp.scss';

window.foundation = $.fn.foundation = require("exports-loader?Foundation!../../../node_modules/foundation-sites/js/foundation.core.js");
require("expose-loader?Reveal!../../../node_modules/foundation-sites/js/foundation.reveal.js");
require("expose-loader?Keyboard!../../../node_modules/foundation-sites/js/foundation.util.keyboard.js");
require("expose-loader?Box!../../../node_modules/foundation-sites/js/foundation.util.box.js");
require("expose-loader?Triggers!../../../node_modules/foundation-sites/js/foundation.util.triggers.js");
require("expose-loader?MediaQuery!../../../node_modules/foundation-sites/js/foundation.util.mediaQuery.js");
require("expose-loader?Motion!../../../node_modules/foundation-sites/js/foundation.util.motion.js");


export default class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    this.modal = {};
    this.state = {
      fullOnce: this.props.fullOnce || false,
      message: this.props.message
    }
  }//end constructor

  componentDidMount() {
    let modal = $(`#${this.props.id}`);
    this.modal = new Foundation.Reveal(modal);

    if(this.props.full === true) {
      let modalBackground = this.modal.$element.find(".wrap-perspective").css("background")
      this.modal.$element.parent().css("background", modalBackground).addClass("full-popup")
    }

    modal.on("closed.zf.reveal",(e)=> {
     // this.childrens.forEach(child => child.resetState());
    })

    if(this.props.lift) this.props.lift(this);
    if(this.props.startDisplayed === true) this.modal.open();
    if(this.props.startDisplayed === false) this.modal.close();
    this.modal.openPopUp = this.openPopUp.bind(this);
    this.modal.closePopUp = this.closePopUp.bind(this);
  }//end componentDidMount

  addChildren(name, child) {
    this.childrens[name] = child;
  }//end addChildren

  openPopUp() {
    let $reveal = this.modal.$element;
    const animation = this.props.animation;
    $reveal.parent().removeClass("disappear");
    if(animation === "scale") {
      $reveal.removeClass("unscale-box");
    } else if(animation === "rebound") {
      $reveal.removeClass("not-rebound");
    } else if(animation === "perspective-right") {
      $reveal.children().removeClass("fix-perspective-right");
    } else if(animation === "perspective-left") {
      $reveal.children().removeClass("fix-perspective-left");
    } else if(animation === "perspective-top") {
      $reveal.children().removeClass("fix-perspective-top");
    } else if(animation === "perspective-bottom") {
      $reveal.children().removeClass("fix-perspective-bottom");
    }
    if(this.state.fullOnce === true) {
      let modalBackground = $reveal.find(".wrap-perspective").css("background");
      $reveal.parent().css("background", modalBackground).addClass("full-popup");
      this.setState({fullOnce: false});
    } else if(this.state.fullOnce === false) {
      $reveal.parent().css("background", "rgba(29, 29, 29, 0.45)").removeClass("full-popup");
    }
    if(this.props.beforeOpen) this.props.beforeOpen();
    this.modal.open();
    if(this.props.afterOpen) this.props.afterOpen();
  }//end openPopUp

  warningTemplate() {
    return (
      <div className={`${this.props.animation === "perspective" ? "perspective" : "" }` +" wrap-perspective"}>
        <div className="wrap-popup-title">
          <i className="material-icons warning-icon">&#xE925;</i>
          <h1 className="warning-title">ADVERTENCIA</h1>
          <span className="warning-subtitle">{this.state.message || 'Accion rechazada, asegurate que la informacion sea correcta e intenta otra vez.'}</span>
        </div>

        <div className="row wrap-popup-options">
          <div className="columns large-12">
            <Button style="btn-warning" lift={ this.addChildren.bind(this, "btn-cancel") } onClick={ this.closePopUp.bind(this) } type="button" data={this.props.textButton || "Cerrar"}/>
          </div>
        </div>
      </div>
    )
  }//end warningTemplate

  loadTemplate() {
    return (
      <div className={`${this.props.animation === "perspective" ? "perspective" : "" }` +" wrap-perspective"}>
        <div className="wrap-popup-loader">
          <span className="spin"></span>
        </div>
      </div>
    )
  }//end loadTemplate

  customTemplate() {
    return (
      <div className="wrap-popup-custom">
        <div className={ this.props.noX ? "hide" : "row columns large-12" } >
          <span className="wrap-icon-close"><i className="material-icons" onClick={ this.closePopUp.bind(this) }>&#xE5CD;</i></span>
        </div>

        { this.props.data }
      </div>
    )
  }//end customTemplate

  closePopUp() {
    let $reveal = this.modal.$element;
    const animation = this.props.animation;
    $reveal.parent().addClass("disappear");

    if(animation === "scale") {
      $reveal.addClass("unscale-box");
    } else if(animation === "rebound") {
      $reveal.addClass("not-rebound");
    } else if(animation === "perspective-right") {
      $reveal.children().addClass("fix-perspective-right");
    } else if(animation === "perspective-left") {
      $reveal.children().addClass("fix-perspective-left");
    } else if(animation === "perspective-top") {
      $reveal.children().addClass("fix-perspective-top");
    } else if(animation === "perspective-bottom") {
      $reveal.children().addClass("fix-perspective-bottom");
    }

    setTimeout(() => {
      if(this.props.beforeClose) this.props.beforeClose();
      this.modal.close();
      if(this.props.afterClose) this.props.afterClose();
    }, this.props.delay || 400)
  }//end closePopUp

  errorTemplate() {
    return (
      <div className={`${this.props.animation === "perspective" ? "perspective" : "" }` +" wrap-perspective"}>
        <div className="wrap-popup-title">
          <i className="material-icons error-icon">&#xE814;</i>
          <h1 className="error-title">Error</h1>
          <span>Se ha producido un error interno, asegurate que el PACK este conectado, por favor intenta mas tarde.</span>
        </div>

        <div className="row wrap-popup-options">
          <div className="columns large-12 wrap-popup-error-btn">
            <Button style="btn-custom" lift={this.addChildren.bind(this, "btn-error-custom")} onClick={ this.closePopUp.bind(this) } type="button" data="Cerrar"/>
          </div>
        </div>
      </div>
    )
  }//end errorTemplate

  whenConfirm() {
    if(this.props.onConfirm) this.props.onConfirm();
    this.closePopUp(this)
  }//end whenConfirm

  confirmTemplate() {
    let animation = this.props.animation;
    let style = "";
    if(animation === "perspective-right") {
      style = animation;
    } else if(animation === "perspective-left") {
      style = animation;
    } else if(animation === "perspective-top") {
      style = animation;
    } else if(animation === "perspective-bottom") {
      style = animation;
    }

    return (
      <div className={`${ style } wrap-perspective` }>
        <div className="wrap-popup-title">
          <i className="material-icons">&#xE000;</i>
          <h1>Confirmación</h1>
          <span>¿ Estas seguro de realizar esta accion ?</span>
        </div>

        <div className="row wrap-popup-options">
          <div className="columns large-6">
            <Button style="btn-cancel" lift={this.addChildren.bind(this, "btn-cancel")} onClick={ this.closePopUp.bind(this) } type="button" data="No"/>
          </div>

          <div className="columns large-6">
            <Button style="btn-confirm" lift={this.addChildren.bind(this, "btn-confirm") } onClick={ this.whenConfirm.bind(this) } type="button" data="Ok"/>
          </div>
        </div>
      </div>
    )
  }//end confirmTemplate

  render() {
    let template, animationStyle, style = "";
    let type = this.props.type || "hide";
    if(type === "confirm") template = this.confirmTemplate();
    if(type === "error") template = this.errorTemplate();
    if(type === "custom") template = this.customTemplate();
    if(type === "warning") template = this.warningTemplate();
    if(type === "load") template = this.loadTemplate();
    if(this.props.animation === "scale") style = "scale-box";
    if(this.props.animation === "rebound") style = "rebound";
    let animation = this.props.animation;

    if(animation === "perspective-right") {
      animationStyle = animation;
    } else if(animation === "perspective-left") {
      animationStyle = animation;
    } else if(animation === "perspective-top") {
      animationStyle = animation;
    } else if(animation === "perspective-bottom") {
      animationStyle = animation;
    }

    return (
      <div className={`${ style } reveal popup text-center`} id={ this.props.id } data-reveal data-close-on-click={ false }>
        <div className={`${ animationStyle } wrap-perspective` }>
          { template }
        </div>
      </div>
    )
  }//end render
}
