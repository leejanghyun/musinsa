import Vue from "vue";
import Vuex from "vuex";
import { Module, VuexModule, getModule, Action } from "vuex-module-decorators";
import axios from 'axios';

function createInstance() {
	const instance = axios.create();
	return instance;
}
const instance = createInstance();

Vue.use(Vuex);

export const store = new Vuex.Store<{ root: RootStore }>({});

export const enum ActionKey {
  requestItemList = 'requestItemList',
}

@Module({
  dynamic: true,
  store,
  name: 'root',
})
class RootStore extends VuexModule {
  /**
   * Item List 불러오기
   * @param { Number } page 불러올 page
   * @param  { Number } size page Size
   * @returns 
   */
  @Action
  async [ActionKey.requestItemList](page = '1', size = '10'): Promise<any> {
    const data: any = [];
    try {
      const baseURL = 'https://www.anapioficeandfire.com';
      const URL = '/api/characters';
      const res = await instance.get(`${baseURL}${URL}?page=${page}&pageSize=${size}`) as any;
      return res.data;
    } catch (error) {
      return data;
    }
  }
}

export default store;
export const rootStore = getModule(RootStore);