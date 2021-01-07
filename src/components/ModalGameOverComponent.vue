<template>
    <b-modal
            v-model="modalGameOver"
            title="Game Over"
            hide-header
            no-close-on-backdrop
    >
        <h4 class="pt-3">Game Over<br>You get {{ myPoints }} points</h4>

        <template #modal-footer="">
            <b-button variant="success" @click="newGame()">
                New game
            </b-button>

        </template>
    </b-modal>
</template>

<script>
export default {
    name: "ModalGameOverComponent",
    props: [
        'modalGameOver',
        'history'
    ],
    computed: {
        myPoints: function () {
            let points = 0
            this.history.forEach((item) => {
                if (item.winner) {
                    points += 0.1
                }
            })

            return points.toFixed(1)
        },
    },
    methods: {
        newGame() {
            this.$emit('new-game')
        }
    }
}
</script>

<style scoped>

</style>