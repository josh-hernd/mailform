<script lang="ts">
	import { Form } from '$lib/Form';
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<div class="wrap">
	<h1>Nodemail Form</h1>
	<p>Testing Nodemailer with Sveltekit.</p>
	<Form {form}/>
	{#if import.meta.env.VITE_CONFIG_ENV === 'dev' && form}
		<a href="{form.ethUrl}" target="_blank" rel="noopener noreferrer">Follow Email</a>
	{/if}
</div>

<style lang="scss">
	.wrap {
		text-align: center;
		padding: var(--page-padding);
	}
	a {
		width: max-content;
		display: block;
		color: #fff;
		padding: 10px 20px;
		margin: 15px auto;
		background: #000;
		text-decoration: none;
	}
</style>
