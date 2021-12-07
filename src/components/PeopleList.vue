<template>
  <div v-if="peopleLoaded" class="people-list-wrapper flex flex-row flex-wrap align-middle justify-center">
    <div class="search-wrapper w-full flex-shrink-0 flex align-middle justify-end py-4 px-10">
      <div class="search">
        <input
          class="py-2 px-4 bg-white font-semibold border-2 border-solid border-gray-700"
          type="text"
          ref="searchText"
          @keydown.enter="searchPeople"
        >
        <button
          class="py-2 px-4 bg-gray-700 text-white font-semibold border-2 border-solid border-gray-700 hover:bg-gray-800"
          @click="searchPeople"
        >Search</button>
        <button
          v-if="searchActive"
          class="py-2 px-4 bg-gray-800 text-white font-semibold border-2 border-solid border-gray-800 hover:bg-gray-900"
          @click="resetPeople"
        >Reset</button>
      </div>
    </div>

    <table class="people-list w-full flex-shrink-0">
      <tr class="people-list__header">
        <th
          class="people-list__header__item"
          :class="sortedClass('name')"
          @click="sortBy('name')"
        >
          Name
        </th>
        <th
          class="people-list__header__item"
          :class="sortedClass('height')"
          @click="sortBy('height')"
        >
          Height
        </th>
        <th
          class="people-list__header__item"
          :class="sortedClass('mass')"
          @click="sortBy('mass')"
        >
          Mass
        </th>
        <th
          class="people-list__header__item"
          :class="sortedClass('created')"
          @click="sortBy('created')"
        >
          Created
        </th>
        <th
          class="people-list__header__item"
          :class="sortedClass('edited')"
          @click="sortBy('edited')"
        >
          Edited
        </th>
        <th
          class="people-list__header__item"
          :class="sortedClass('planet')"
          @click="sortBy('planet')"
        >
          Planet
        </th>
      </tr>
      <tr
        v-for="person in sortedPeople"
        :key="person.url"
        class="people-list__person"
      >
        <td class="people-list__person__item people-list__person__name">
          {{ person.name }}
        </td>
        <td class="people-list__person__item people-list__person__height">
          {{ person.height }}
        </td>
        <td class="people-list__person__item people-list__person__mass">
          {{ person.mass }}
        </td>
        <td class="people-list__person__item people-list__person__created">
          {{ dateDisplay(person.created) }}
        </td>
        <td class="people-list__person__item people-list__person__edited">
          {{ dateDisplay(person.edited) }}
        </td>
        <td
          class="people-list__person__item people-list__person__planet bg-yellow-400 font-semibold text-black hover:bg-yellow-500 hover:cursor-pointer"
          @click="showPlanetModal(person.planet)"
        >
          {{ person.planet.name }}
        </td>
      </tr>
    </table>

    <div class="pagination-wrapper w-full flex-shrink-0 flex align-middle justify-end py-4 px-10">
      <div class="pagination">
        <button
          v-show="$store.getters.GET_CURRENT_PAGE.previous"
          class="py-2 px-4 bg-gray-700 text-white font-semibold border-2 border-solid border-gray-700 hover:bg-gray-800"
          @click="pagePeople('previous', $store.getters.GET_CURRENT_PAGE.previous)"
        >Prev</button>

        <div
          v-show="$store.getters.GET_CURRENT_PAGE.page > 0"
          class="pagination__number inline-block py-2 px-4 bg-white font-semibold border-2 border-solid border-gray-700"
          min="1"
          ref="paginationNumber"
        >
          {{ $store.getters.GET_CURRENT_PAGE.page }}
        </div>

        <button
          v-show="$store.getters.GET_CURRENT_PAGE.next"
          class="py-2 px-4 bg-gray-700 text-white font-semibold border-2 border-solid border-gray-700 hover:bg-gray-800"
          @click="pagePeople('next', $store.getters.GET_CURRENT_PAGE.next)"
        >Next</button>
      </div>
    </div>

    <PlanetModal
      v-show="showModal"
      :planet="currentPlanet"
      @closeModal="closePlanetModal"
    />
  </div>
  <div
    v-else
    class="py-2 px-4 bg-black text-yellow-400 font-semibold"
  >
    <h1>Getting people from a galaxy far, far away...</h1>
  </div>
</template>

<script>
import axios from 'axios';
import PlanetModal from './PlanetModal.vue';

export default {
  name: 'PeopleList',

  components: {
    PlanetModal,
  },

  data() {
    return {
      peopleLoaded: false,
      searchActive: false,
      sort: {
        key: '',
        isAsc: false,
      },
      showModal: false,
      currentPlanet: null,
    };
  },

  created() {
    this.$store.dispatch('INIT_GET_PEOPLE_FROM_API')
      .then(() => {
        if (this.$store.getters.GET_CURRENT_PAGE_PEOPLE.length) {
          this.getPeoplesPlanets();
        }
      });
  },

  mounted() {
  },

  computed: {
    sortedPeople() {
      const peopleList = this.$store.getters.GET_CURRENT_PAGE_PEOPLE;
      if (this.sort.key) {
        if (this.sort.key === 'height' || this.sort.key === 'mass') {
          peopleList.sort((personA, personB) => {
            // Need to parseInt for Height and Mass
            const aSorted = parseInt(personA[this.sort.key], 10);
            const bSorted = parseInt(personB[this.sort.key], 10);
            const sortOrder = aSorted > bSorted ? 1 : -1;

            return (aSorted === bSorted ? 0 : sortOrder) * (this.sort.isAsc ? 1 : -1);
          });
        } else if (this.sort.key === 'planet') {
          peopleList.sort((personA, personB) => {
            // Sort on the "name" object key
            const aSorted = personA[this.sort.key]['name'];
            const bSorted = personB[this.sort.key]['name'];
            const sortOrder = aSorted > bSorted ? 1 : -1;

            return (aSorted === bSorted ? 0 : sortOrder) * (this.sort.isAsc ? 1 : -1);
          });
        } else {
          peopleList.sort((a, b) => {
            // Sort on the table column key
            const aSorted = a[this.sort.key];
            const bSorted = b[this.sort.key];
            const sortOrder = aSorted > bSorted ? 1 : -1;

            return (aSorted === bSorted ? 0 : sortOrder) * (this.sort.isAsc ? 1 : -1);
          });
        }
      }
      return peopleList;
    },
  },

  methods: {
    sortedClass(key) {
      return this.sort.key === key ? `sorted ${this.sort.isAsc ? 'asc' : 'desc'}` : '';
    },

    sortBy(key) {
      this.sort.isAsc = this.sort.key === key ? !this.sort.isAsc : false;
      this.sort.key = key;
    },

    dateDisplay(date) {
      const returnDate = new Date(date);
      return returnDate.toLocaleDateString();
    },

    searchPeople() {
      this.peopleLoaded = false;
      const searchString = this.$refs.searchText.value;
      this.$store.dispatch('GET_SEARCH_PERSON', { search: searchString })
        .then(() => {
          if (this.$store.getters.GET_CURRENT_PAGE_PEOPLE.length) {
            this.getPeoplesPlanets();
          }
          this.searchActive = true;
        });
    },

    resetPeople() {
      this.peopleLoaded = false;

      this.$store.dispatch('GET_PAGE_PEOPLE_FROM_API', { page: 1, direction: 'next', pageUrl: 'https://swapi.dev/api/people/?page=1' })
        .then(() => {
          if (this.$store.getters.GET_CURRENT_PAGE_PEOPLE.length) {
            this.getPeoplesPlanets();
          }
          this.searchActive = false;
        });
    },

    pagePeople(direction, pageUrl) {
      this.peopleLoaded = false;
      const directionPageNumber = direction === 'previous' ?
        this.$store.getters.GET_CURRENT_PAGE.page - 1 :
        this.$store.getters.GET_CURRENT_PAGE.page + 1;

      this.$store.dispatch('GET_PAGE_PEOPLE_FROM_API', { page: directionPageNumber, direction: direction, pageUrl: pageUrl })
        .then(() => {
          if (this.$store.getters.GET_CURRENT_PAGE_PEOPLE.length) {
            this.getPeoplesPlanets();
          }
        });
    },

    async getPeoplesPlanets() {
      console.warn('getPeoplesPlanets');
      const currentPeople = this.$store.getters.GET_CURRENT_PAGE_PEOPLE;
      const currentPlanets = this.$store.getters.GET_PLANETS;
      for (const person of currentPeople) {
        let personsPlanet;
        const planetsIndex = currentPlanets.findIndex(
          (planet) => planet.url === person.homeworld,
        );

        if (planetsIndex === -1) {
          await axios
            .get(person.homeworld)
            .then((response) => response.data)
            .then((planetData) => {
              personsPlanet = planetData;
              this.$store.dispatch('ADD_PLANET_TO_PLANETS', planetData);
            });
        } else {
          personsPlanet = this.$store.getters.GET_PLANETS[planetsIndex];
        }

        person.planet = personsPlanet;
      }
      this.peopleLoaded = true;
    },

    // async getPersonsPlanet(homeworld) {
    //   let personsPlanet;
    //   const planetsIndex = this.$store.getters.GET_PLANETS.findIndex(
    //     (planet) => planet.url === homeworld,
    //   );

    //   if (planetsIndex === -1) {
    //     await axios
    //       .get(homeworld)
    //       .then((response) => response.data)
    //       .then((planetData) => {
    //         personsPlanet = planetData;
    //       });
    //   } else {
    //     personsPlanet = this.$store.getters.GET_PLANETS[planetsIndex];
    //   }

    //   return personsPlanet;
    // },

    showPlanetModal(planet) {
      this.currentPlanet = planet;
      this.showModal = true;
    },

    closePlanetModal() {
      this.showModal = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search-wrapper, .pagination-wrapper {
  background-color: $light-grey;
}

.pagination {
  &__number {
    width: 80px;
  }
}

.people-list {
  background-color: $light-grey;

  &__header {
    background-color: $dark-grey;
    color: white;

    &__item {
      padding: 0.5rem 1rem;

      &:hover {
        cursor: pointer;
        background-color: lighten($color: $dark-grey, $amount: 20);
      }

      &.sorted {
        &.asc::after {
          display: inline-block;
          content: '▼';
        }
        &.desc::after {
          display: inline-block;
          content: '▲';
        }
      }
    }
  }

  &__person {
    border-top: solid 1px $mid-grey;
    &:last-child {
      border-bottom: solid 1px $mid-grey;
    }

    &__item {
      padding: 0.5rem 1rem;
    }
  }
}
</style>
