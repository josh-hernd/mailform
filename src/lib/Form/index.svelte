<script lang="ts">
	import { onMount } from 'svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { captchaVal, isEmpty, isNumber, random_rgba } from './index';

	type FormType = {
		name: string;
		phone: string;
		email: string;
		_captcha: string;
	};
	export let form: any;

	const ramdValue = captchaVal();

	let emptyForm = {} as FormType;

	async function handleSubmit(this: HTMLFormElement) {
		const data = new FormData(this);
		const response = await fetch(this.action, {
			method: 'POST',
			body: data,
			headers: { gotCha: ramdValue, 'x-sveltekit-action': 'true' }
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}

	let canvas: any;
	onMount(() => {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = random_rgba();
		ctx.font = 'bold 18px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(ramdValue, canvas.width / 2, canvas.height / 2);
	});

	let count = '200 character limit';

	function checkWordLen(this: HTMLTextAreaElement) {
		if (this.value.length == this.maxLength) {
			count = `${this.value.length} character limit reached`;
		} else {
			count = `${this.maxLength - this.value.length} character limit`;
		}
	}
</script>

<div
	class="status {form?.error ? 'error' : ''} {form?.msg ? 'success' : ''}"
	style="display: {form?.error || form?.msg ? 'block' : 'none'};"
>
	{#if form?.error}
		<h1>{form.error}</h1>
	{:else if form?.msg}
		<h1>{form?.msg}</h1>
	{/if}
</div>
{#if !form?.success}
	<form method="POST" action="?/contact" on:submit|preventDefault={handleSubmit}>
		<div class="field">
			<label for="First Last">First, Last Name</label>
			<input type="text" name="First Last" bind:value={emptyForm.name} required />
		</div>

		<div class="field">
			<label for="Phone">Phone Number</label>
			<input
				type="tel"
				name="Phone"
				bind:value={emptyForm.phone}
				on:input={isNumber}
				maxlength="11"
				required
			/>
		</div>

		<div class="field">
			<label for="Email">Email</label>
			<input type="email" name="Email" bind:value={emptyForm.email} required />
		</div>

		<div class="field">
			<label for="info">Additional info </label>
			<span>- {count}</span>
			<textarea name="Info" cols="30" rows="10" on:input={checkWordLen} maxlength="200" />
		</div>

		<div class="_human">
			<label for="_gotcha">Prove you are a Human</label>
			<div class="field">
				<canvas bind:this={canvas} width={100} height={50} />
				<input
					type="text"
					name="_gotcha"
					bind:value={emptyForm._captcha}
					maxlength="4"
					autocomplete="off"
				/>
			</div>
		</div>
		<div class="field"><button disabled={isEmpty(emptyForm, ramdValue)}>Send</button></div>
	</form>
{/if}

<style lang="scss">
	._human {
		width: max-content;
		position: relative;
		padding: 30px 10px 10px;
		margin: 22px auto 0px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: rgb(226, 226, 226);
		border-radius: 6px;
		.field {
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-top: 0;
			input {
				padding: 10px;
				background: #000;
			}

		}
		label {
			position: absolute;
			top: 10px;
			left: 0;
			right: 0;
			font-size: 12px;
			font-weight: 400;
			color: rgb(0, 0, 0);
			user-select: none;
			-webkit-user-select: none;
			-moz-user-select: none;
			pointer-events: none;
		}
	}
	span {
				position: absolute;
				bottom: 10px;
				right: 10px;
				font-size: 12px;
				font-weight: 400;
				color: rgb(255, 255, 255);
				user-select: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				pointer-events: none;
			}
</style>
