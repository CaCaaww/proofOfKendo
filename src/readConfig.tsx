import axios from "axios";
import { useEffect, useState } from "react";


export const FetchUrlFromFile = async () => {
    const [api, setApi] = useState("potato");
    useEffect(() => {
    axios.get("./config.json").then((res) => {
      setApi(res.data.apiUrl);
      console.log(res.data.apiUrl)
    });
    }, []);
    return api;
}
    
