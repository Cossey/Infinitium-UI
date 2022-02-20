
import { createStore } from 'framework7/lite';

const store = createStore({
  state: {
    token: "",
    products: [],
    retryRequest: null,
    failedRequests: [],
    user: "",
    domain: "",
    tsigKeyNames: [],
  },
  getters: {
    tsigNames({state}) {
      return state.tsigKeyNames;
    },
    token({ state }) {
      return state.token || localStorage.getItem('token');
    },
    user({ state }) {
      return state.user;
    },
    domain({ state }) {
      return state.domain;
    },
    products({ state }) {
      return state.products;
    },
    retryRequest({state}) {
      return state.retryRequest;
    },
    failedRequests({state}) {
      return state.failedRequests;
    }
  },
  actions: {
    tsigNames({state}, tsigNames) {
      state.tsigKeyNames = tsigNames;
    },
    domain({state}, domain) {
      state.domain = domain;
    },
    user({state}, usr) {
      state.user = usr;
    },
    token({ state }, tkn) {
      state.token = tkn;
      localStorage.setItem('token', tkn);
    },
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
    setRetryRequest({ state }, retryReq) {
      state.retryRequest = retryReq;
    },
    addFailedRequest({ state }, failedReq) {
      state.failedRequests.push(failedReq); // = [...state.failedRequests, failedReq];
    }
  },
})
export default store;
