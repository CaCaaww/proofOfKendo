
    var apiUrl = ''
    const fetchUrl = async () => {
        const responseTest  = await fetch("/config.json");
        const file = await responseTest.json();
        console.log(file)
        console.log(file.apiUrl)
        apiUrl = file.apiUrl
    }
    fetchUrl();
    
const api_url = apiUrl;
export default api_url;