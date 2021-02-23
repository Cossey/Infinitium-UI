
import { createStore } from 'framework7/lite';

const store = createStore({
  state: {
    token: "",
    products: [],
    retryRequest: null
  },
  getters: {
    token({ state }) {
      return state.token;
    },
    products({ state }) {
      return state.products;
    },
    retryRequest({state}) {
      return state.retryRequest;
    }
  },
  actions: {
    token({ state }, tkn) {
      state.token = tkn;
    },
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
    setRetryRequest({ state }, retryReq) {
      state.retryRequest = retryReq;
    }
  },
})
export default store;
