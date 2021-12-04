<template>
  <div class="people-list-wrapper flex align-middle justify-center">
    <table class="people-list w-full">
      <tr class="people-list__header bg-gray-100">
        <th class="people-list__header__item">Name</th>
        <th class="people-list__header__item">Height</th>
        <th class="people-list__header__item">Mass</th>
        <th class="people-list__header__item">Created</th>
        <th class="people-list__header__item">Edited</th>
        <th class="people-list__header__item">Planet</th>
      </tr>
      <tr
        v-for="person in people"
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
import { mapState } from 'vuex';

export default {
  name: 'PeopleList',
  props: {
    msg: String,
  },
  mounted() {
    this.$store.dispatch('GET_PEOPLE');
  },
  computed: mapState([
    'people',
  ]),
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
