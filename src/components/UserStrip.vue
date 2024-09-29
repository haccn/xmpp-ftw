<script setup lang='ts'>
	import { Show, type Presence } from '@/utils/presence'
  import { rosterSet } from '@/utils/roster';

  const props = defineProps<{
	jid: string,
	name?: string,
	subscription?: string,
	presence?: Presence,
  }>()

  function getStatusCircleClass() {
	return {
	  away: props.presence?.show === Show.Away,
	  dnd: props.presence?.show === Show.Dnd,
	  offline: props.presence?.type === 'unavailable' || props.presence?.show === Show.Xa,
	}
  }
</script>

<template>
	<div id='main'>
		<div id='pfp'>
			<img src='/default_pfp.webp'/>
			<span v-if='props.presence' id='statusCircle' v-bind:class='getStatusCircleClass()'></span>
		</div>
		<div id='text'>
			<strong>{{ props.name ?? props.jid }}</strong>
			<small>{{ props.presence?.status }}</small>
			<small style='opacity: 0.5'>{{ props.subscription }}</small>
		</div>
		<button @click="() => rosterSet({ jid: props.jid, subscription: 'remove' })">x</button>
	</div>
</template>

<style scoped>
#main {
	display: flex;
	gap: 0.5rem;
}

  #pfp {
	  position: relative;
  }

  img {
	  width: 32px;
	  height: 32px;
	  border-radius: 50%;
  }

  #statusCircle {
	  width: 12px;
	  height: 12px;
	  border-radius: 50%;
	  display: inline-block;

	  position: absolute;
	  bottom: 0;
	  right: 0;

	  background: green;
  }
  #statusCircle.away {
	  background: yellow;
  }
  #statusCircle.dnd {
	  background: red;
  }
  #statusCircle.offline {
	  background: gray;
  }

  #text {
  }

  small {
	  display: block;
  }

  button {
	  margin-left: auto;
  }
</style>
