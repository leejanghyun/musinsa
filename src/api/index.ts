import axios from 'axios';

function createInstance() {
	const instance = axios.create();
	return instance;
}
const instance = createInstance();

/**
 * Item List 불러오기
 * @param { Number } page 불러올 page
 * @param  { Number } size page Size
 * @returns 
 */
async function requestItemList(page: number = 1, size: number = 10) {
  const res: any = [];
	try {
    const baseURL = 'https://www.anapioficeandfire.com';
    const URL = '/api/characters';
    const res = await instance.get(`${baseURL}${URL}?page=${page}&pageSize=${size}`);
		return res.data;
	} catch (error) {
		return res;
	}
}