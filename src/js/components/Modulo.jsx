import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import '../../scss/components/Modulo.scss';


export default class Modulo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }//end constructor

  render(){
    return(
      <div className="row columns large-10">
        <h1>Listado de modulos</h1>

        <div className="wrap-modulos">
          <table className="Modules-table">
        <thead>
          <tr>
            <th width="200">
              <i className="material-icons">&#xE30C;</i>
              <span>Nombre del modulo</span>
            </th>
            <th width="200">
              <i className="material-icons">&#xE916;</i>
              <span>Fecha de creación</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.data.map((modulo, index) =>{
              return(
                <tr key={ index }>
                  <td>{ modulo.name }</td>
                  <td>{moment(modulo.createdAt).format("YYYY-MM-DD")}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
        </div>
      </div>



    )
  }
}

