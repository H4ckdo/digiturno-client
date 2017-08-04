//@ sourceMappingUR=/assets/js/modulo.bundle.js.map

import {Pie} from 'react-chartjs-2';
import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import PopUp from './PopUp.jsx';
import { Chart } from 'react-chartjs-2';
import { fetchData } from '../actions/epsActions.js';

import '../../scss/components/Graph.scss';

var ModulName = []
var ModulDispach =[]
var hexadecimal
var ranColor
var posarray
var colores = []
let topeModul
function getRandomColor(){
   for (var o = 0; o < topeModul; o++) {
    hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F")
    ranColor = "#";
    for ( var i=0;i<6;i++){
      posarray = Math.floor(Math.random()*(hexadecimal.length))
      ranColor =  ranColor.concat(hexadecimal[ posarray])
    }
    colores.push(ranColor)

   }
   return ranColor
}


const graficando = () => ({
  labels: ModulName,
  datasets: [{
    data:ModulDispach,
    backgroundColor:colores

  }]
});

var graph = graficando()
var cuajo

const op= {
        title: {
          display: true,
          text: 'Turnos despachados al mes por modulo'
        }
    }
var porcent = 0
var maxPorcent = 0
var maxTokenmonth = 0
var TokensDispach = 0
var maxDispachedmonth = 0

const añosu = ["2017", "2018", "2019", "2020","2021","2022","2023","2024","2025","2026","2027","2028",
               "2029","2030","2031","2032","2033","2034","2035","2036","2037","2038","2039","2040",
               "2041","2042","2043","2044","2045","2046","2047","2048","2049","2050"]

const meses =["Enero","Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
              "Sptiembre", "Octubre", "Noviembre", "Diciembre"]



export default class Grafica extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value:0, años:"2017", graph, data: []};// data:[]
    this.Upchange = this.Upchange.bind(this);
    this.Upchange2= this.Upchange2.bind(this);
    this.Upsend = this.Upsend.bind(this);
    this.childrens = {};
  }//end constructor

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  componentDidMount() {
    if(this.props.lift) this.props.lift(this);
  }//end componentDidMount


  async requestData(SADDRESS) {
    console.log(SADDRESS,'SADDRESS');
    this.childrens.loader.modal.openPopUp();
    try {
      let responseModulo = await fetchData(`http://${SADDRESS}:1337/modulo/showAll`, this.childrens);
      this.setState({data: responseModulo.payload.data});
      this.childrens.loader.modal.closePopUp();
    } catch (e) {
      console.log('e', e);
      this.childrens.loader.modal.closePopUp();
      this.childrens.fail.modal.openPopUp();
    }
    /*
    */
  }//end requestData


  calculateMax() {
    console.log("hey")
    maxTokenmonth = 0
    if (this.state.data) {
      this.state.data.map((modulo,index) =>{
        modulo.tokens.map((element, index) =>{
          if (moment(element.createdAt).month() == this.state.value && moment(element.createdAt).year() == this.state.años) {
            maxTokenmonth = maxTokenmonth + 1
          }
        })
      })
    }
    return(
      <span>Total de turnos en el mes: {maxTokenmonth}</span>
    )
  }//end calculateMax

calculatedPorcent(){
  for (var i = 0; i < ModulDispach.length; i++) {
    porcent = (eval(ModulDispach[i])*100)/maxDispachedmonth
    ModulName[i] = ModulName[i].concat('(' + porcent.toFixed(2) +'%)')
  }
    maxPorcent = (maxDispachedmonth*100)/maxTokenmonth
    this.setState({graph:graficando()});
}// end calculatedPorcent

  Upchange(event) {
    this.setState({value: event.target.value});
  }

   Upchange2(event) {
    this.setState({años: event.target.value});
  }

Upsend(event) {
  if ( maxTokenmonth === 0){
    this.childrens.Nodata.openPopUp();
    maxDispachedmonth = 0
    maxPorcent = 0
    porcent = 0
    ModulName = []
    for (var i = 0; i < ModulDispach.length; i++) {
      ModulDispach[i]=0
    }
     this.setState({graph:graficando()});

  }else{
    maxDispachedmonth = 0
    if(this.state.data){//props>state
      topeModul = this.state.data.length
      this.state.data.map((modulo, index) =>{
        TokensDispach=0
        getRandomColor()
        modulo.tokens.map((element, index) =>{
          if (element.dispached == true && moment(element.dispatchAt).month() == this.state.value && moment(element.dispatchAt).year() == this.state.años) {
            TokensDispach = TokensDispach+1
            maxDispachedmonth = maxDispachedmonth + 1
          }
        })
        ModulDispach[index]=TokensDispach
        ModulName[index] = (modulo.name)
      })

    }
    this.calculatedPorcent()
  }
  event.preventDefault();
}//end Upsend


 render() {
  var viewMax = this.calculateMax()

  return (
    <div className="row columns large-10 medium-10 small-10">
       <PopUp
          lift={ this.addChildren.bind(this, "Nodata") }
          id="Nodata"
          animation={ "rebound" }
          full={ true }
          type="warning"
          message="No se han encontrado registros de la fecha seleccionada"
        />


      <h4 className="grafica-title">SELECCIONA UNA FECHA:</h4>
      <form  onSubmit={this.Upsend}>
          <select className="selector" value={this.state.años} onChange={this.Upchange2}>
            {
              añosu.map((año, index) =>{
                return(
                  <option key={index} value={año} >{año}</option>
                  )
              })
            }
          </select>
          <select className="selector"  value={this.state.value} onChange={this.Upchange}>
            {
              meses.map((mes, index) =>{
                return(
                  <option key={index} value={index}>{mes}</option>
                  )
              })
            }
          </select>
          <input className="submi" type="submit"  value="Graficar" />
        </form>
        <div className="wrap-grafica-text">
          {viewMax}
          <span>Total de turnos despachados en el mes : {maxDispachedmonth} ({maxPorcent.toFixed(2)}% del total)</span>
        </div>
        <Pie ref='chart' data={this.state.graph} options={op} redraw={true}/>


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
    </div>
  )
}
};
