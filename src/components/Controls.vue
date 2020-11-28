<template>
    <div>
        <div class="question">
            Next card will be?
        </div>

        <div class="pt-3">

            <div class="pt-3">
                <b-button @click="assertYounger()" variant="outline-light" size="lg" v-bind:disabled="!canBeYounger">
                    Younger
                </b-button>
                &nbsp;
                <b-button @click="assertOlder()" variant="outline-light" size="lg" v-bind:disabled="!canBeOlder">
                    Older
                </b-button>
            </div>

            <div class="result-message" v-if="answer && cardIsLoaded" v-bind:class="[winner ? 'win' : 'loose']">
                <span v-if="winner">
                    You win!
                </span>
                <span v-else>
                    You loose
                </span>
            </div>

            <div class="lucky" v-show="luckyMan && cardIsLoaded">
                Instant win!
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "Controls",
    props: {
        winner: Boolean
    },
    methods: {
        assertYounger() {
            this.answer = 'younger'
            this.oldCard = this.card
            this.cardIsLoaded = false
            this.getData()
        },

        assertOlder() {
            this.answer = 'older'
            this.oldCard = this.card
            this.cardIsLoaded = false
            this.getData()
        },

    }
}
</script>

<style scoped>

</style>