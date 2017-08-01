const copyCollection = ((collection) => {
  return collection.map((element) => Object.assign({} ,element));
})
module.exports.copyCollection = copyCollection;

module.exports.mapActions = function(response, textStatus, error) {
  const status =  this.request.status;
  const findCase = ((cases) => cases.status.some(code => code === status));
  const mapIds = ((cases) => {
    if(cases.endpoint && this.id) cases.endpoint = cases.endpoint.replace(/:(\w){1,20}/g, this.id);
    return cases;
  })

  let successCaseMapped = copyCollection(this.responseCases.success).map(mapIds);
  let successWithEndPoints = successCaseMapped.filter((cases) => (cases.endpoint && (cases.endpoint === response.endpoint))).find(findCase);
  let successCase = successCaseMapped.find(findCase);

  let failCaseMapped = copyCollection(this.responseCases.fails).map(mapIds);
  let failWithEndPoints = failCaseMapped.filter((cases) => (cases.endpoint && (cases.endpoint === response.endpoint))).find(findCase);
  let failCase = failCaseMapped.find(findCase);

  if(successWithEndPoints) {
    return this.resolve({
      ...successWithEndPoints,
      payload: response,
      modals: this.modals
    })
  }

  if(successCase) {
    return this.resolve({
      ...successCase,
      payload: response,
      modals: this.modals
    })
  }

  if(failWithEndPoints) {
    return this.resolve({
      ...failWithEndPoints,
      error,
      modals: this.modals
    })
  }

  if(failCase) {
    return this.resolve({
      ...failCase,
      error,
      modals: this.modals
    })
  }
  /*
   */

  return this.reject({...this.responseCases.otherWise, modals: this.modals});
}//end mapActions

module.exports.validWord = (data = "") => {
  let result = /[A-Za-zñÑ0-9_]{1,10}/i.exec(data);
  if(result) return (result[0].length === data.length);
  return false;
}//end validWord

module.exports.epsName = (data = "") => {
  let result = /[A-Za-zñÑ0-9_ ]{2,40}/i.exec(data);
  if(result) return (result[0].length === data.length);
  return false;
}//end validWord

module.exports.validPassword = (data = "")=> ((data.length >= 6 || data.length <= 20) && !/(\W)/g.test(data));//end validPassword

module.exports.validText = (data = "")=> {
  let result = /[A-Za-zñÑ0-9_ ]{3,500}/i.exec(data);
  if(result) return (result[0].length === data.length);
  return false;
}//end validText

module.exports.capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}//end capitalize

module.exports.validInteger = (value) => {
  let result = /[0-9]{1,23}/i.exec(value);
  if(result) return (result[0].length === value.length);
  return false;
}//end integer
