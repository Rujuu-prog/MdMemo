<script setup lang="ts">
import { ref, defineProps } from "vue";
const memo = ref("");
const props = defineProps({
  content: String,
});
if (props.content !== undefined) {
  memo.value = props.content;
}
// const filePath = ref("");
// const emits = defineEmits(["update:filePath"]);

// const listener = (filepath: string, data: string) => {
//   console.log(filepath);
//   console.log(data);
//   filePath.value = filepath;
//   memo.value = data;
//   // emits("update:filePath", filepath);
// };
// window.electronAPI.openFileDialog((_e, filepath, data) =>
//   listener(filepath, data)
// );
</script>

<template>
  <div class="memo h-full">
    <textarea
      v-model="memo"
      placeholder="メモを入力してください"
      class="memo-input h-full"
    ></textarea>
  </div>
</template>

<style scoped>
.memo {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
.memo-input {
  width: 100%;
  padding: 0;
  border: none;
  resize: none;
}
</style>
