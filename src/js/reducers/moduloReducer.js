export const Modulo = (state, options) => {
  if(options.type === "PAINT_MODULO") {
    return { ...state, data: options.payload.data }
  }
  return { ...state }
}//end Modulo
