<script lang="ts">
import { fly } from "svelte/transition";
</script>
<nav out:fly="{{y: -100}}"><a href="/">Main</a></nav>
<style lang="scss">
    nav{
        width: 230px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        padding: 20px;
        background: #000;
        text-align: center;
        border-radius: 0px 0px 50px 50px;
        a {
            color: #fff;
            text-decoration: none;
        }
    }
</style>