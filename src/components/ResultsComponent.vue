<template>
    <div class="result">
        <div v-if="isWinner" class="win">You win!</div>
        <div v-else class="loose">You loose</div>
    </div>
</template>

<script>

export default {
    name: 'ResultsComponent',
    props: ['history'],
    computed: {
        round() {
            let round = 0
            if (this.history) {
                round = this.history.length - 1
            }

            return round
        },
        isWinner() {
            const item = this.getHistoryItem()
            if (item) {
                return item.winner === true
            }

            return null
        },
    },
    methods: {
        getHistoryItem() {
            return this.history[this.history.length - 1]
        }
    }
}
</script>

<style scoped>

</style>