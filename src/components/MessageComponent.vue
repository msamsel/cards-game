<template>
    <div>
        <div v-if="isEqual" class="lucky">
            Cards are equal, round skipped
        </div>

        <div class="lucky" v-show="hasLucky">
            Instant win!
        </div>
    </div>
</template>

<script>
export default {
    name: "MessageComponent",
    props: [
        'isEqual',
        'hasLucky'
    ]
}
</script>

<style scoped>

</style>