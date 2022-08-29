import axios from "axios";

export const fetcher = axios.create({
    baseURL:"http://localhost:8000/api/"
})