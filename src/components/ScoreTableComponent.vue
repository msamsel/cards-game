<template>
    <div>
        <b-list-group-item class="bg-dark text-white" v-for="(item, key) in history" :key="key">
            {{item.card.value}} {{item.answer === 'older' ? 'is older' : 'is younger'}} than
            {{item.oldCard.value}} - {{item.winner ? 'you won!' : 'you loosed...'}}
        </b-list-group-item>
    </div>
</template>

<script>
export default {
    name: "ScoreTableComponent",
    props: [
        'history'
    ]
}
</script>

<style scoped>

</style>