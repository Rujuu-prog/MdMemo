<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { theme } from "ant-design-vue";

// タブの情報を保持する配列
const panes = ref<
  {
    title: string; // タブのタイトル
    content: string; // タブの内容
    filePath: string; // 保存されたファイルのパス
    key: string; // タブを一意に識別するためのキー
    closable?: boolean; // タブが閉じられるかどうか
  }[]
>([
  // 初期のタブ設定
  { title: "New Memo", content: "", filePath: "", key: "1" },
]);

// 現在アクティブなタブのキー
const activeKey = ref(panes.value[0].key);

// 新しいタブのインデックス（タブ追加時に使用）
const newTabIndex = ref(0);

// タブを追加する関数
const add = (filePath: string | false, content: string | false) => {
  activeKey.value = `newTab${++newTabIndex.value}`;
  panes.value.push({
    title: filePath ? getFileName(filePath) : "New Memo",
    content: content ? String(content) : "",
    filePath: filePath ? String(filePath) : "",
    key: activeKey.value,
  });
};

// タブを削除する関数
const remove = (targetKey: string) => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1;
    }
  });
  const newPanes = panes.value.filter((pane) => pane.key !== targetKey);
  panes.value = newPanes;
  if (panes.value.length && activeKey.value === targetKey) {
    activeKey.value =
      lastIndex >= 0 ? panes.value[lastIndex].key : panes.value[0].key;
  }
};

// タブの追加または削除を行うイベントハンドラ
const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === "add") {
    add(false, false);
  } else {
    remove(targetKey as string);
  }
};

// ファイルオープンダイアログからのファイル選択を処理
window.electronAPI.openFileDialog((_e, filePath, data) => {
  add(filePath, data);
});

// ファイルパスからファイル名を取得する関数
const getFileName = (filePath: string) => {
  return filePath.split("/").pop() || `New Tab`;
};

// コンポーネントがマウントされた後の処理
onMounted(() => {
  // 保存リクエストの処理
  window.electronAPI.onSaveRequest(() => {
    const currentPane = panes.value.find(
      (pane) => pane.key === activeKey.value
    );
    if (currentPane) {
      window.electronAPI.saveFile(
        currentPane.content,
        currentPane.filePath || undefined
      );
    }
  });

  // ファイルが保存された後の処理
  window.electronAPI.onFileSaved((_event, savedFilePath) => {
    const currentPane = panes.value.find(
      (pane) => pane.key === activeKey.value
    );
    if (currentPane) {
      const fileName = getFileName(savedFilePath);
      currentPane.filePath = savedFilePath;
      currentPane.title = fileName;
    }
  });
});
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <a-tabs
      class="h-100"
      v-model:activeKey="activeKey"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane
        class="h-100"
        v-for="pane in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="pane.closable"
      >
        <textarea
          v-model="pane.content"
          placeholder="メモを入力してください"
          class="memo-input"
        ></textarea>
      </a-tab-pane>
    </a-tabs>
  </a-config-provider>
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
  height: 100%;
  padding: 0;
  border: none;
  resize: none;
}
.h-100 {
  height: 100%;
}
:deep(.ant-tabs-content) {
  height: 100%;
}
</style>
