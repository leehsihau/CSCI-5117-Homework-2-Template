<template>
    <div class="catLink">
        {{link}}
    </div>
</template>

<script>
    export default {
        name: "CatLink",
        props: {
            link: String
        }
    }
</script>

<style scoped>
    a.toggle {
        display: inline-block;
        padding: 10px;
        border: 1px solid lightgray;
    }
</style>