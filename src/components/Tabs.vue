<script setup>
import { ref, reactive, nextTick, onMounted } from "vue";
import Tab from "./Tab.vue";
import TabButton from "./TabButton.vue";

const tabs = reactive([
  { id: 1, name: "Tab 1", content: "", active: true },
  { id: 2, name: "Tab 2", content: "", active: false },
  { id: 3, name: "Tab 3", content: "", active: false },
  //   { id: 4, name: "Tab 4", content: "n", active: false },
]);

function addTab(tabName, content) {
  // 既存のすべてのタブを非アクティブにする
  //   tabs.forEach((tab) => {
  //     tab.active = false;
  //   });
  const nextId = tabs.length + 1;
  tabs.push({
    id: nextId,
    name: tabName,
    content: content,
    active: false,
  });
  //   window.HSStaticMethods.autoInit();
  //   setTimeout(() => {
  //   }, 500);
  nextTick(() => {
    setTimeout(() => {
      window.HSStaticMethods.autoInit();
    }, 500);
  });
}
onMounted(() => {
  setTimeout(() => {
    window.HSStaticMethods.autoInit();
  }, 500);
});

function getFileName(filePath) {
  return filePath.split("/").pop() || `New Tab`;
}

function removeTab(tabId) {
  tabs.value = tabs.value.filter((tab) => tab.id !== tabId);
}

// 新しいファイルが選択された時
window.electronAPI.openFileDialog((_e, filepath, data) => {
  const tabName = getFileName(filepath);
  addTab(tabName, data);
});
</script>

<template>
  <select
    id="tab-select"
    class="sm:hidden py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
    aria-label="Tabs"
    role="tablist"
  >
    <option
      v-for="tab in tabs"
      :key="tab.id"
      :value="`#hs-tab-to-select-${tab.id}`"
    >
      {{ tab.name }}
    </option>
  </select>

  <div class="hidden sm:block border-b border-gray-200 dark:border-gray-700">
    <nav class="flex space-x-2" aria-label="Tabs" role="tablist">
      <TabButton
        v-for="tab in tabs"
        :key="tab.id"
        :tabNumber="tab.id"
        :defaultClass="tab.active ? 'active' : ''"
        :tabName="tab.name"
      />
      <button @click="addTab">+</button>
      <!-- タブ追加ボタン -->
    </nav>
  </div>

  <div class="mt-3 h-full">
    <Tab
      v-for="tab in tabs"
      :key="tab.id"
      :tabNumber="tab.id"
      :defaultClass="tab.active ? '' : 'hidden'"
      :content="tab.content"
    />
  </div>
</template>

<style scoped></style>
