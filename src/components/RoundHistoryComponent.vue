<template>
    <div class="score-table">
        <div class="float-right">Points: {{ myPoints }}</div>
        <div class="">Round: {{ round }} of {{ maxRounds }}</div>
    </div>
</template>

<script>
export default {
    name: "RoundHistoryComponent",
    props: [
        'round',
        'points',
        'maxRounds'
    ],
    computed: {
        myPoints: function () {
            return this.points.toFixed(1)
        }
    }
}
</script>

<style scoped>

</style>