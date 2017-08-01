import React from 'react';
import '../../scss/components/Header.scss';
import $ from 'jquery';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }//end constructor

  selectTab(tab, id) {
    let $tab = $(`.${tab}`);
    let $panel = $(`#${id}`);
    let $wrapPanels = $("#wrap-tabs-panels");
    if($tab.hasClass("is-active") === false) {
      let $parent = $tab.parent();
      let $active = $parent.find(".is-active");
      $active.removeClass("is-active");
      $tab.addClass("is-active");
      $wrapPanels.find("section:not(.hide)").addClass("hide");
      $panel.removeClass("hide");
    }
  }//end selectTab

  render() {
    return (
      <div className="wrap-header">
        <header>
          <div className="row columns large-10">
            <h1 className="header-title">ORTOPEDICOS DEL PACIFICO</h1>
            <h2 className="header-subtitle">Digiturno</h2>
          </div>

          <nav>
            <ul className="wrap-options row columns large-10">
              <li className="tab is-active tab-turnos" onClick={this.selectTab.bind(this, "tab-turnos", "section_turno")}>
                <a href="#">
                  <i className="material-icons">&#xE8D3;</i>
                  <span>Turnos</span>
                </a>
              </li>

              <li className="tab tab-contratos" onClick={this.selectTab.bind(this,"tab-contratos", "section_contratos")}>
                <a href="#">
                  <i className="material-icons">&#xE873;</i>
                  <span>Contratos</span>
                </a>
              </li>

              <li className="tab tab-modulos" onClick={this.selectTab.bind(this,"tab-modulos", "section_modulos")}>
                <a href="#">
                  <i className="material-icons">&#xE241;</i>
                  <span>Modulos</span>
                </a>
              </li>

            </ul>

          </nav>
        </header>
      </div>
    )
  }
};
