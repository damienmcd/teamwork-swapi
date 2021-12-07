<template>
  <div class="modal-outer-wrapper absolute flex items-center justify-center w-full h-full left-0 top-0 bg-black bg-opacity-70">
    <div class="modal-wrapper relative flex items-center justify-center rounded shadow-2xl p-10 bg-white">
      <div
        class="modal__close-wrapper absolute block w-10 h-10 right-0 top-0 bg-black"
        @click="$emit('closeModal')"
      >
        <div class="modal__close"></div>
      </div>

      <div class="modal__content w-full">
        <div class="modal__content__header mb-2 font-bold text-lg">
          {{ planet.name }}
        </div>
        <div class="modal__content__detail mb-2">
          Diameter: {{ planet.diameter }}
        </div>
        <div class="modal__content__detail mb-2">
          Climate: {{ planet.climate }}
        </div>
        <div class="modal__content__detail mb-2">
          Population: {{ planet.population }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanetModal',
  props: {
    planet: Object,
  },

  mounted() {
  },

  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-wrapper {
  width: 90%;
}

.modal {
  &__close-wrapper {
    content: "\00d7";
  }

  &__close {
    position: absolute;
    right: 4px;
    top: 4px;
    width: 32px;
    height: 32px;
    opacity: 0.5;

    &:hover {
      opacity: 1;
      cursor: pointer;
    }

    &::before, &::after {
      position: absolute;
      left: 15px;
      content: ' ';
      height: 33px;
      width: 2px;
      background-color: white;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
}
</style>
