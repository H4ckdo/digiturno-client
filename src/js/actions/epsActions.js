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

export const fetchData = (url = "", modals) => {
  return (
    new Promise((resolve, reject)=> {
      const request = $.ajax({
        method: "GET",
        url
      })
      request.always(mapActions.bind({modals, request, resolve, reject, responseCases }));
    })
  )
}//end fetchData

export const create = (url = "", data = {}, modals) => {
  return (
    new Promise((resolve, reject)=> {
      const request = $.ajax({
        method: "POST",
        data,
        url
      })
      request.always(mapActions.bind({modals, request, resolve, reject, responseCases}));
    })
  )
}//end create

export const removeData = (url = "", id, modals) => {
  return (
    new Promise((resolve, reject)=> {
      const request = $.ajax({
        method: "DELETE",
        url
      })
      request.always(mapActions.bind({id, modals, request, resolve, reject, responseCases}));
    })
  )
}//end create

export const updateData = (url = "", id, modals, data) => {
  return (
    new Promise((resolve, reject)=> {
      const request = $.ajax({
        method: "PUT",
        url,
        data
      })
      request.always(mapActions.bind({id, modals, request, resolve, reject, responseCases}));
    })
  )
}//end create
