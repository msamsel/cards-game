<template>
    <div>
        <p>{{cardIsLoaded}}

        <div v-show="!cardIsLoaded" class="picking-card">Picking a card...</div>
        <img v-show="cardIsLoaded" v-bind:src="card.image" @load="onImgLoad" alt="card">

    </div>
</template>

<script>

export default {
    name: "Card",
    props: {
        card: Object,
        cardIsLoaded: Boolean
    },
    data() {
        return {
            isLoaded: this.cardIsLoaded
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