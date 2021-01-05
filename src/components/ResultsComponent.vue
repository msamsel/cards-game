<template>
    <div>
        <div>

            <div v-if="!issEqual" class="result-message" v-bind:class="[winner ? 'win' : 'loose']">
                <div v-if="winner">You win!</div>
                <div v-else>You loose</div>
            </div>

            <div v-else class="lucky">
                Cards are equal, round skipped
            </div>

        </div>

        <div class="lucky" v-show="isLuckyMan && !issEqual">
            Instant win!
        </div>

    </div>
</template>

<script>

export default {
    name: "ResultsComponent",
    props: [
        'isLuckyMan',
        'winner'
    ],
    computed: {
        issEqual: function() {
            return this.winner === null;
        }
    }
}
</script>

<style scoped>

</style>