<template>
    <div>
        <div v-show="isEqual" class="lucky">
            Cards are equal, round skipped
        </div>

        <div v-show="hasLucky" class="lucky" >
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