<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error">
	<h1>{$page.status} {$page?.error?.message}: {$page.url.pathname}</h1>
</div>

<style lang="scss">
	.error {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
        color: #fff;
	}
</style>
