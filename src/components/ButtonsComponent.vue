<template>
    <div>
        <b-button
            variant="outline-light"
            size="lg"
            v-bind:disabled="!canBeYounger"
            @click="giveAnswer('younger')"
        >
            Younger
        </b-button>
        &nbsp;
        <b-button
            variant="outline-light"
            size="lg"
            v-bind:disabled="!canBeOlder"
            @click="giveAnswer('older')"
        >
            Older
        </b-button>
    </div>
</template>

<script>
export default {
    name: "ButtonsComponent",
    props: [
        'card',
    ],
    data() {
        return {
            minCard: '2',
            maxCard: 'ACE'
        }
    },
    computed: {
        canBeYounger: function () {
            return this.card ? this.card.value !== this.minCard : false;
        },
        canBeOlder: function () {
            return this.card ? this.card.value !== this.maxCard : false;
        }
    },
    methods: {
        giveAnswer(answer) {
            this.$emit('user-answer', answer)
        }
    }
}
</script>

<style scoped>

</style>