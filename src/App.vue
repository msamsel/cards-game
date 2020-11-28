<template>
    <div id="app" class="container">
        <GameComponent class="game"/>
    </div>
</template>

<script>
import GameComponent from "@/components/GameComponent";

export default {
    name: 'App',
    components: {
        GameComponent
    }
}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>