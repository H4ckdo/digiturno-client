export const Modulo = (state, options) => {
  if(options.type === "PAINT_MODULO") {
    options.modals.loader.closePopUp();
    return { ...state, data: options.payload.data }
  }
  else if (options.type === "LOADER") {
    options.modals.loader.openPopUp();
    return { ...state };
  }
  return { ...state }
}//end Modulo
