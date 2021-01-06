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
name: "ModalGameOverComponent"
}
</script>

<style scoped>

</style>