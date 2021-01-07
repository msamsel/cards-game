<template>
    <div>
        <div>
            <div v-if="!isEqual" class="result-message">

                <div v-if="isWinner" class="win">You win!</div>
                <div v-else class="loose">You loose</div>

            </div>

            <div v-else class="lucky">
                Cards are equal, round skipped
            </div>

        </div>

        <div class="lucky" v-show="hasLucky">
            Instant win!
        </div>

    </div>
</template>

<script>

export default {
    name: "ResultsComponent",
    props: [
        'history'
    ],
    computed: {
        isWinner() {
            const item = this.getHistoryItem()
            return item.winner === true
        },
        isEqual() {
            const item = this.getHistoryItem()
            return item.winner === null
        },
        hasLucky() {
            const item = this.getHistoryItem()
            const luckyIndex = [2, 'ACE']
            const cardValue = isNaN(item.card.value) ? item.card.value : parseInt(item.card.value)

            return luckyIndex.find(index => index === cardValue)
        }
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