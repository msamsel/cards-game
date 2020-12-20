<template>
    <div>
        <div class="result-message" v-if="answer" v-bind:class="[winner ? 'win' : 'loose']">
            <span v-if="winner">You win!</span>
            <span v-else>You loose</span>
        </div>

        <div class="lucky" v-show="isLuckyMan">
            Instant win!
        </div>

    </div>
</template>

<script>
export default {
    name: "ResultsComponent",
    props: ['winner', 'answer', 'isLuckyMan']
}
</script>

<style scoped>

</style>