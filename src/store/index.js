import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentPage: 0,
    currentPageHasPrevious: false,
    currentPageHasNext: true,
    pagedPeople: {},
    currentPagePeople: [],
    planets: [],
  },

  getters: {
    GET_CURRENT_PAGE_PEOPLE: (state) => state.currentPagePeople,

    GET_CURRENT_PAGE: (state) => state.currentPage,

    GET_PLANETS: (state) => state.planets,
  },

  mutations: {
    SET_CURRENT_PAGE_PEOPLE(state, people) {
      state.currentPagePeople = people;
    },

    SET_PAGED_PEOPLE(state, payload) {
      if (!state.pagedPeople.hasOwnProperty(payload.page)) {
        const newPage = { people: payload.people, previous: payload.previous, next: payload.next };
        state.pagedPeople[payload.page] = newPage;
      }
    },

    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },

    ADD_PLANET_TO_PLANETS(state, planet) {
      state.planets.push(planet);
    },
  },

  actions: {
    async INIT_GET_PEOPLE_FROM_API({ commit }) {
      await axios
        .get("https://swapi.dev/api/people/")
        .then((response) => response.data)
        .then((peopleData) => {
          if (peopleData.results.length) {
            commit("SET_CURRENT_PAGE_PEOPLE", peopleData.results);
            commit("SET_PAGED_PEOPLE", {
              page: 1,
              people: peopleData.results,
              previous: peopleData.previous,
              next: peopleData.next,
            });
            commit("SET_CURRENT_PAGE", {
              page: 1,
              previous: peopleData.previous,
              next: peopleData.next,
            });
          }
        });
    },

    async GET_PAGE_PEOPLE_FROM_API({ state, commit }, payload) {
      if (!state.pagedPeople.hasOwnProperty(payload.page)) {
        await axios
          .get(payload.pageUrl)
          .then((response) => response.data)
          .then((peopleData) => {
            if (peopleData.results.length) {
              commit("SET_CURRENT_PAGE_PEOPLE", peopleData.results);
              commit("SET_PAGED_PEOPLE", {
                page: payload.page,
                people: peopleData.results,
                previous: peopleData.previous,
                next: peopleData.next,
              });
              commit("SET_CURRENT_PAGE", {
                page: payload.page,
                previous: peopleData.previous,
                next: peopleData.next,
              });
            }
          });
      } else {
        commit("SET_CURRENT_PAGE_PEOPLE", state.pagedPeople[payload.page].people);
        commit("SET_CURRENT_PAGE", {
          page: payload.page,
          previous: state.pagedPeople[payload.page].previous,
          next: state.pagedPeople[payload.page].next,
        });
      }
    },

    async GET_SEARCH_PERSON({ state, commit }, payload) {
      let foundPeople = [];
      const searchUrl = "https://swapi.dev/api/people/?search=" + payload.search;

      await axios
        .get(searchUrl)
        .then((response) => response.data)
        .then((peopleData) => {
          if (peopleData.results.length) {
            commit("SET_CURRENT_PAGE_PEOPLE", peopleData.results);
            commit("SET_CURRENT_PAGE", {
              page: 0,
              previous: null,
              next: null,
            });
          }
        });

      // Check people that have been loaded already to avoid unnecessary calls to the API
      // This won't work as there may be some people that have yet to be retrieved from the API
      // for (const [pageNumber, page] of Object.entries(state.pagedPeople)) {
      //   if (page.hasOwnProperty("people") && Array.isArray(page.people)) {
      //     page.people.forEach((person) => {
      //       const personName = person.name.toUpperCase();
      //       if (personName.indexOf(searchString) > -1) {
      //         foundPeople.push(person);
      //       }
      //     });
      //   }
      // }
    },

    ADD_PLANET_TO_PLANETS({ commit }, planet) {
      commit("ADD_PLANET_TO_PLANETS", planet);
    },
  },
  modules: {},
});
