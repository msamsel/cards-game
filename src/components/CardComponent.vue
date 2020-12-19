<template>
    <div>
        <div v-show="!cardIsLoaded" class="picking-card">Picking a card...</div>
        <img v-show="cardIsLoaded" v-bind:src="card.image" @load="onImgLoad">
    </div>
</template>

<script>

export default {
    name: "CardComponent",
    props: [
        'card'
    ],
    data() {
        return {
            cardIsLoaded: false
        }
    },
    methods: {
        onImgLoad() {
            this.cardIsLoaded = true
        }
    }
}
</script>

<style scoped>

</style>