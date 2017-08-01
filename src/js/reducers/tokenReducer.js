import { copyCollection } from '../utils'

export const Token = (state, options) => {
  if(options.type === "PAINT_TOKEN") {
    let data = copyCollection(state.data);
    delete options.type;
    data.push(options);
    return { ...state, data };
  }

  if(options.type === "UPDATE_TOKEN") {
    console.log('UPDATE_TOKEN');
  }

  if(options.type === "DISPATCH_TOKEN") {
    let data = copyCollection(state.data);
    let n;
    data.forEach((elements, index) => elements.id === options.payload.data[0].id ? n = index : n );
    data.splice(n , 1);
    return { ...state, data };
  }


  return { ...state }
}
