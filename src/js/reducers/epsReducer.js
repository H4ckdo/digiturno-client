export const EPS = (state, {type, modals, payload}) => {
  if(type === "PAINT_DATA") {
    modals.loader.closePopUp();
    return { ...state, data: payload.data };
  }

  else if(type === "LOADER") {
    modals.loader.openPopUp();
    modals.contrato.childrens.popUpEPS.closePopUp();
    return { ...state };
  }

  else if(type === "CONFIRM") {
    //modals.confirm.openPopUp();
    return { ...state };
  }

  else if(type === "CREATED_DATA") {
    modals.loader.closePopUp();
    if(localStorage.getItem("Modulo") === null) {
      modals.PopUpCreateModulo.modal.closePopUp();
      localStorage.setItem("Modulo", payload.data.id);
      return {...state };
    } else {
      let data = state.data.map(data => Object.assign({}, data));
      data.unshift(payload.data);
      return {...state, data };
    }
  }

  else if(type === "UPDATE_DATA") {
    let data = state.data.map(data => Object.assign({}, data));
    let position;
    data.find((element, index) => element.id === payload.data[0].id ? position = index : position = 0);
    data[position] = payload.data[0];
    modals.contrato.childrens.popUpUpdateEPS.closePopUp();
    modals.loader.closePopUp();
    return { ...state, data };
  }


  else if(type === "ERROR_UI") {
    return { ...state };
  }

  else if(type === "UNEXPECTED_RESPONSE") {
    modals.loader.closePopUp();
    modals.fail.openPopUp();
    return { ...state };
  }

  else if(type === "ALREADY_EXIST") {
    modals.loader.closePopUp();
    modals.contrato.childrens.popUpUpdateEPS.closePopUp();
    modals.conflicPopUp.openPopUp();
    return { ...state };
  }

  else if(type === "PULL_DATA") {
    let data = state.data.map(data => Object.assign({}, data));
    let position;
    data.find((element, index) => element.id === payload.data[0].id ? position = index : position = 0);
    data.splice(position, 1);
    modals.loader.closePopUp();
    return { ...state, data };
  } else {
    return { ...state };
  }
}//end EPS
