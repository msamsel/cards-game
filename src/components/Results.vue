<template>
    <div>
        <div v-show="round" class="score-table">
            <div class="float-right">Points: {{myPoints}}</div>
            <div class="">Round: {{round}} of {{maxRounds}}</div>

        </div>
        <b-list-group v-if="answer || roundsHistory">
            <b-list-group-item class="bg-dark text-white" v-for="(item, key) in roundsHistory" :key="key">
                {{ item.newCard }} {{ item.answer === 'older' ? 'is older' : 'is younger' }}
                than {{ item.oldCard }} - {{ item.winner ? 'you won!' : 'you loosed...' }}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
export default {
    name: "Results",
    props: {
        round: String,
        answer: Boolean,
        roundsHistory: String
    }
}
</script>

<style scoped>

</style>