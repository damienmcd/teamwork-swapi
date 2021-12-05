<template>
  <div class="people-list-wrapper flex align-middle justify-center">
    <table class="people-list w-full">
      <tr class="people-list__header bg-gray-100">
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
          {{ person.created }}
        </td>
        <td class="people-list__person__item people-list__person__edited">
          {{ person.edited }}
        </td>
        <td class="people-list__person__item people-list__person__planet">
          {{ person.homeworld }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
  name: 'PeopleList',
  props: {
    msg: String,
  },
  data() {
    return {
      peopleLoaded: false,
      sort: {
        key: '',
        isAsc: false,
      },
    };
  },
  created() {
    this.$store.dispatch('GET_PEOPLE');
  },
  computed: {
    sortedPeople() {
      const peopleList = this.$store.getters.people;
      if (this.sort.key) {
        // Need to parseInt for Height and Mass
        if (this.sort.key === 'height' || this.sort.key === 'mass') {
          peopleList.sort((personA, personB) => {
            const aSorted = parseInt(personA[this.sort.key], 10);
            const bSorted = parseInt(personB[this.sort.key], 10);
            const sortOrder = aSorted > bSorted ? 1 : -1;

            return (aSorted === bSorted ? 0 : sortOrder) * (this.sort.isAsc ? 1 : -1);
          });
        } else {
          peopleList.sort((a, b) => {
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.people-list {
  background-color: $table-body;

  &__header {
    background-color: $table-header;
    color: white;

    &__item {
      padding: 0.5rem 1rem;
    }
  }

  &__person {
    border-top: solid 1px $table-border;
    &:last-child {
      border-bottom: solid 1px $table-border;
    }

    &__item {
      padding: 0.5rem 1rem;
    }
  }
}
</style>
