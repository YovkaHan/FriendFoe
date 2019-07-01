import axios from "axios";

export const dataDownload = (api) => {
    return axios.get(`${SERVER}${api}`).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    })
};