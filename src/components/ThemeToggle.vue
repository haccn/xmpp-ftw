<script setup lang='ts'>
  import { setIsDarkTheme, getIsDarkTheme } from '../utils/theme'

  let isDarkTheme = getIsDarkTheme()

  function setTheme(e: Event) {
    const el = e.target as HTMLInputElement
    isDarkTheme = el.checked
    setIsDarkTheme(el.checked)
  }
</script>

<template>
  <input
    id='c'
    type='checkbox'
    :checked='isDarkTheme'
    @change='setTheme'/>
  <label for='c'>dark theme</label>
</template>
