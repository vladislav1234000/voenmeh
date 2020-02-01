import axios from 'axios';

const API_URL 	= 'https://krethub.design:8000/';

axios.defaults.headers.common = {
    Accept: "application/json, text/plain, */*"
};

export default class API {

    async send(method = 'GET', action, data = {}) {
        const response = await axios({
            method,
            url: `${API_URL}${action}`,
            data
        }).catch(error => {
            console.error('Error API:', error);
        //    window.showAlert(getMessage('server_offline'));
          //  return { "status": false, "failed": error.response.data.message }
        });
        return response ? response.data : [];
    }

    async POSTGeoPosition(meet) {
        let response = await this.send('POST', 'GeoPosition', meet);

        console.log('API: ', 'POSTGeoPosition', response);

        return response;
    }
    async GetGroups(faculty) {
        let response = await this.send('GET',  `GetGroups?faculty=${faculty}`, null);

        console.log('API: ', 'GetGroups', response);
        //if(response === []) response = {group: '1'}
        return response;
    }
    async GetWeek() {
        let response = await this.send('GET',  `GetWeek`, null);

        console.table('API: ', 'GetWeek', response);

        return response;
    }
    async GetSchedule(faculty) {
        let response = await this.send('GET',  `GetSchedule?group=${faculty}`, null);

        console.log('API: ', 'GetSchedule');
        console.table(response)
        return response;
    }

}
