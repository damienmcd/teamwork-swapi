import Vue from 'vue';
import axios from 'axios';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentPeoplePage: 1,
    people: [],
    planets: [],
  },
  getters: {
    people: (state) => state.people,
  },
  mutations: {
    SET_PEOPLE(state, people) {
      state.people = people;
    },
  },
  actions: {
    GET_PEOPLE({ commit }) {
      axios
        .get('https://swapi.dev/api/people/')
        .then((response) => response.data)
        .then((data) => {
          commit('SET_PEOPLE', data.results);
        });
    },
  },
  modules: {},
});
