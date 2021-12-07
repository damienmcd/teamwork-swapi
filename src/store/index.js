import Vue from 'vue';
import axios from 'axios';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentPage: 0,
    people: [],
    planets: [],
  },

  getters: {
    GET_PEOPLE: (state) => state.people,

    GET_PLANETS: (state) => state.planets,
  },

  mutations: {
    SET_PEOPLE(state, people) {
      state.people = people;
    },

    ADD_PLANET_TO_PLANETS(state, planet) {
      state.planets.push(planet);
    },
  },

  actions: {
    async GET_PEOPLE_FROM_API({ commit }) {
      await axios
        .get('https://swapi.dev/api/people/')
        .then((response) => response.data)
        .then((peopleData) => {
          if (peopleData.results.length) {
            commit('SET_PEOPLE', peopleData.results);
          }
        });
    },

    ADD_PLANET_TO_PLANETS({ commit }, planet) {
      commit('ADD_PLANET_TO_PLANETS', planet);
    },
  },
  modules: {},
});
