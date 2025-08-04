import axios from "axios";

const JSON_URL = 'https://jsonplaceholder.typicode.com/todos/1';

async function getUsers() {
    const response = await axios.get(`${JSON_URL}/users`)
    return response.data;
}

async function getPosts() {
    const response = await axios.get(`${JSON_URL}/posts`)
    return response.data;

}

export const DataService = {
  getUsers,
  getPosts
};