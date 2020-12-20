<template>
    <div>
        <b-button
            @click="makeAnswer('younger')"
            variant="outline-light"
            size="lg"
            v-bind:disabled="!canBeYounger"
        >
            Younger
        </b-button>
        &nbsp;
        <b-button
            @click="makeAnswer('older')"
            variant="outline-light"
            size="lg"
            v-bind:disabled="!canBeOlder"
        >
            Older
        </b-button>
    </div>
</template>

<script>
export default {
    name: "ButtonsComponent",
    props: [
        'canBeYounger',
        'canBeOlder'
    ],
    methods: {
        makeAnswer(answer) {
            this.$emit('make-answer', answer)
        }
    }
}
</script>

<style scoped>

</style>