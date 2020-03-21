import axios from 'axios';

const API_URL 	= 'https://vkgo.voenmeh.ru/';

axios.defaults.headers.common = {
    Accept: "application/json, text/plain, */*"
};

export default class API {

    async send(method = 'GET', action, data = {}, url = API_URL) {
        const response = await axios({
            method,
            url: `${url}${action}`,
            data
        }).catch(error => {
            console.error('Error API:', error);
        //    window.showAlert(getMessage('server_offline'));
          //  return { "status": false, "failed": error.response.data.message }
        });
        return response ? response.data : [];
    }


    async GetStatus(id) {
        let response = await this.send('GET',  `getUserStatus?id=${id}`, null, 'https://manaenckov.design/api/voenmeh/');

        console.log('API: ', 'GetStatus', response);

        return response;
    }
    async GetNews(fac) {
        let response = await this.send('GET',  `getNews?fac=${fac}`, null, 'https://manaenckov.design/api/voenmeh/');

        console.log('API: ', 'GetNews', response);

        return response;
    }

    async POSTGeoPosition(meet) {
        let response = await this.send('POST', 'GeoPosition', meet);

        console.log('API: ', 'POSTGeoPosition', response);

        return response;
    }
    async GetOffices(faculty) {
        let response = await this.send('GET',  `GetOffices?faculty=${faculty}`, null);

        console.log('API: ', 'GetOffices', response);

        return response;
    }
    async GetBanners(faculty) {
        let response = await this.send('GET',  `GetBanners?faculty=${faculty}`, null);

        console.log('API: ', 'GetBanners', response);

        return response;
    }
    async GetNews2(faculty) {
        let response = await this.send('GET',  `GetNews?faculty=${faculty}`, null);

        console.log('API: ', 'GetNews', response);

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

        console.log('API: ', 'GetWeek', response.week);

        return response.week;
    }
    async GetSchedule(faculty) {
        let response = await this.send('GET',  `GetSchedule?group=${faculty}`, null);

        console.log('API: ', 'GetSchedule');
        console.table(response)
        return response;
    }

}
