<template>
    <div>
        <b-modal
            v-model="modalContinue"
            hide-header
            no-close-on-backdrop
        >
            <h4 class="pt-3">Do you want to continue the game?</h4>

            <template #modal-footer="">
                <b-button variant="success" @click="continueGame()">
                    Yes
                </b-button>
                <b-button variant="danger" @click="cancelGame()">
                    No
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import VueCookies from "vue-cookies";

export default {
    name: "ModalContinue",
    methods: {
        continueGame() {
            let history = VueCookies.get('roundsHistory');

            this.roundsHistory = JSON.parse(history)
            this.roundsHistory.forEach(item => {
                this.points += item.winner ? 0.1 : 0;
            })

            this.modalContinue = false
        },

        cancelGame(){
            VueCookies.remove('roundsHistory')
            this.modalContinue = false
        },

    }
}
</script>

<style scoped>

</style>