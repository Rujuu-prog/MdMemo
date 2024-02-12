<script setup>
const props = defineProps({
  tabNumber: Number,
  defaultClass: String,
  tabName: String,
});
const tabId = `hs-tab-to-select-item-${props.tabNumber}`;
const tabDataHsTab = `#hs-tab-to-select-${props.tabNumber}`;
const tabAriaControls = `hs-tab-to-select-${props.tabNumber}`;
</script>
<template>
  <button
    type="button"
    :class="`${defaultClass} hs-tab-active:bg-white hs-tab-active:border-b-transparent hs-tab-active:text-blue-600 dark:hs-tab-active:bg-gray-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`"
    :id="tabId"
    :data-hs-tab="tabDataHsTab"
    :aria-controls="tabAriaControls"
    role="tab"
  >
    {{ tabName }}
  </button>
</template>
<style scoped></style>
