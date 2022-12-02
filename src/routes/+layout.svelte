<script lang="ts">
    import '../styles/app.scss';
    import { page } from '$app/stores';
    import Nav from '$lib/nav/Nav.svelte';
</script>
{#if $page.url.pathname !== '/'}
    <Nav />
{/if}
<slot />
