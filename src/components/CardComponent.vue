<template>
    <div>
        <div v-show="!cardIsLoaded" class="picking-card">Picking a card...</div>
        <img v-show="cardIsLoaded" v-bind:src="card.image" @load="loaded" alt="Card">
    </div>
</template>

<script>

export default {
    name: "CardComponent",
    props: ['card'],
    computed: {
        cardIsLoaded() {
            return this.card
        }
    },
    methods: {
        loaded() {
            this.$emit('is-loaded')
        }
    }
}
</script>

<style scoped>

</style>