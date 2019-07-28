import axios from "axios";

export const getData = (api) => {
    return axios.get(`${SERVER}${api}`).then(function (response) {
        return response;
    }).catch(error => {
        console.error(error);
        return {
            error
        };
    })
};

export const postData = (api, data) => {
    return axios.post(`${SERVER}${api}`, data).then(function (response) {
        return response;
    }).catch(error => {
        console.error(error);
        return {
            error
        };
    })
};

export const putData = (api, data) => {
    return axios.put(`${SERVER}${api}`, data).then(function (response) {
        return response;
    }).catch(error => {
        console.error(error);
        return {
            error
        };
    })
};

export const deleteData = (api) => {
    return axios.delete(`${SERVER}${api}`).then(function (response) {
        return response;
    }).catch(error => {
        console.error(error);
        return {
            error
        };
    })
};