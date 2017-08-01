import $ from 'jquery';
import { mapActions } from '../utils';

const responseCases = {
  success: [
    {
      type: "PAINT_DATA",
      status: [200]
    },
    {
      type: "PAINT_MODULO",
      endpoint: "/modulo/showAll",
      status: [200]
    },
    {
      endpoint: "/EPS/update/:id",
      type: "UPDATE_DATA",
      status: [200]
    },
    {
      type: "CREATED_DATA",
      status: [201]
    },
    {
      endpoint: "/EPS/delete/:id",
      type: "PULL_DATA",
      status: [202]
    }
  ],
  fails: [
    {
      type: "ERROR_UI",
      status: [400]
    },
    {
      type: "NOT_FOUND",
      status: [404]
    },
    {
      type: "ALREADY_EXIST",
      status: [409]
    }
  ],
  otherWise: {
    type: "UNEXPECTED_RESPONSE"
  }
}
export const dispatchToken = (url = "", id, modals, data) => {
  return (
    new Promise((resolve, reject)=> {
      const request = $.ajax({
        method: "PUT",
        url,
        data
      })
      request.always((response, textStatus, error) => {
        modals.loader.modal.closePopUp();
        if(response.status === 200) {
          resolve({
            type: "DISPATCH_TOKEN",
            payload: response,
            modals: modals
          })
        } else {
          modals.fail.modal.closePopUp();
          reject({
            type: "UNEXPECTED_RESPONSE",
            error: error,
            modals: modals
          })
        }
      })

    })
  )
}//end create
