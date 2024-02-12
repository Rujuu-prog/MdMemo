<script setup>
import { ref } from "vue";
import Memo from "./Memo.vue";
const props = defineProps({
  tabNumber: Number,
  defaultClass: String,
  content: String,
});
// const emits = defineEmits(["update:filePath"])
// filePathを保存するためのrefを作成
const receivedFilePath = ref("");
// 子コンポーネントからfilePathを受け取るための関数
// const handleFilePathUpdate = (filePath) => {
//   emits("update:filePath", filePath);
// };

const tabId = `hs-tab-to-select-${props.tabNumber}`;
const tabAriaLabelledBy = `hs-tab-to-select-item-${props.tabNumber}`;
</script>
<template>
  <div
    :id="tabId"
    role="tabpanel"
    :aria-labelledby="tabAriaLabelledBy"
    :class="`${defaultClass} h-full`"
  >
    <div class="p-3 sm:p-0 h-full">
      <p>{{ tabNumber }}</p>
      <Memo :content="content" />
    </div>
  </div>
</template>
<style scoped></style>
