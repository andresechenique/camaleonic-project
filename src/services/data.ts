import axios from "axios";

const JSON_URL = 'https://jsonplaceholder.typicode.com/todos/1';

const photos = [
  {
    "albumId": 1,
    "id": 1,
    "title": "Nature #1",
    "url": "https://picsum.photos/id/1015/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/1015/150/100.jpg"
  },
  {
    "albumId": 1,
    "id": 2,
    "title": "Nature #2",
    "url": "https://picsum.photos/id/237/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/237/600/400.jpg"
  },
  {
    "albumId": 1,
    "id": 3,
    "title": "Nature #3",
    "url": "https://picsum.photos/id/1035/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/1035/150/100.jpg"
  },
  {
    "albumId": 1,
    "id": 4,
    "title": "Nature #4",
    "url": "https://picsum.photos/id/1043/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/1043/150/100.jpg"
  },
  {
    "albumId": 2,
    "id": 5,
    "title": "Tech #1",
    "url": "https://picsum.photos/id/180/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/180/150/100.jpg"
  },
  {
    "albumId": 2,
    "id": 6,
    "title": "Tech #2",
    "url": "https://picsum.photos/id/237/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/237/150/100.jpg"
  },
  {
    "albumId": 2,
    "id": 7,
    "title": "Tech #3",
    "url": "https://picsum.photos/id/238/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/238/150/100.jpg"
  },
  {
    "albumId": 2,
    "id": 8,
    "title": "Tech #4",
    "url": "https://picsum.photos/id/239/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/239/150/100.jpg"
  },
  {
    "albumId": 3,
    "id": 9,
    "title": "City #1",
    "url": "https://picsum.photos/id/252/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/252/150/100.jpg"
  },
  {
    "albumId": 3,
    "id": 10,
    "title": "City #2",
    "url": "https://picsum.photos/id/254/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/254/150/100.jpg"
  },
  {
    "albumId": 3,
    "id": 11,
    "title": "City #3",
    "url": "https://picsum.photos/id/255/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/255/150/100.jpg"
  },
  {
    "albumId": 3,
    "id": 12,
    "title": "City #4",
    "url": "https://picsum.photos/id/256/600/400.jpg",
    "thumbnailUrl": "https://picsum.photos/id/256/150/100.jpg"
  },
  {
    "albumId": 4,
    "id": 13,
    "title": "Abstract #1",
    "url": "https://placehold.co/600x400/cccccc/333333?text=Abstract+1",
    "thumbnailUrl": "https://placehold.co/150x100/cccccc/333333?text=A1"
  },
  {
    "albumId": 4,
    "id": 14,
    "title": "Abstract #2",
    "url": "https://placehold.co/600x400/bb8888/ffffff?text=Abstract+2",
    "thumbnailUrl": "https://placehold.co/150x100/bb8888/ffffff?text=A2"
  },
  {
    "albumId": 4,
    "id": 15,
    "title": "Abstract #3",
    "url": "https://placehold.co/600x400/88bb88/ffffff?text=Abstract+3",
    "thumbnailUrl": "https://placehold.co/150x100/88bb88/ffffff?text=A3"
  },
  {
    "albumId": 4,
    "id": 16,
    "title": "Abstract #4",
    "url": "https://placehold.co/600x400/8888bb/ffffff?text=Abstract+4",
    "thumbnailUrl": "https://placehold.co/150x100/8888bb/ffffff?text=A4"
  }
];

async function getUsers() {
    const response = await axios.get(`${JSON_URL}/users`)
    return response.data;
}

async function getPosts() {
    const response = await axios.get(`${JSON_URL}/posts`)
    return response.data;

}

async function getComments() {
    const response = await axios.get(`${JSON_URL}/comments`)
    return response.data;

}


async function getAlbums() {
    const response = await axios.get(`${JSON_URL}/albums`)
    return response.data;

}

async function getPhotos() {
    // const response = await axios.get(`${JSON_URL}/photos`)
    // return response.data;
    return photos;
}

async function getTodos() {
    const response = await axios.get(`${JSON_URL}/todos`)
    return response.data;

}

export const DataService = {
  getUsers,
  getPosts,
  getAlbums,
  getComments,
  getPhotos,
  getTodos
};