<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { theme } from "ant-design-vue";
import extractFileNameForTabTitle from "../utils/extractFileNameForTabTitle";
import { convertMarkdownToHtml } from "../utils/markdownToHtml";
import { convertHtmlToMarkdown } from "../utils/htmlToMarkdown";

// タブの情報を保持する配列
const panes = ref<
  {
    title: string; // タブのタイトル
    content: any; // タブの内容
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
const add = async (filePath: string | false, content: string | false) => {
  activeKey.value = `newTab${++newTabIndex.value}`;
  const newPane = {
    title: extractFileNameForTabTitle(filePath),
    content: content ? await convertMarkdownToHtml(content) : "",
    filePath: filePath ? String(filePath) : "",
    key: `newTab${newTabIndex.value}`,
  };
  panes.value.push(newPane);

  await nextTick(); // DOMの更新を待つよう指示

  // DOMが更新された後、contentが渡されていた場合は新しいタブの内容を更新
  if (content) {
    const editableDivs = document.querySelectorAll(".editable-content");
    const newDiv = editableDivs[editableDivs.length - 1]; // 新しく追加されたdivを取得
    if (newDiv) {
      newDiv.innerHTML = content; // 新しいcontentの内容でdivを更新
    }
  }
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
  const htmlContent = convertMarkdownToHtml(data);
  add(filePath, htmlContent);
});

// コンポーネントがマウントされた後の処理
onMounted(() => {
  // 保存リクエストの処理
  window.electronAPI.onSaveRequest(() => {
    const currentPane = panes.value.find(
      (pane) => pane.key === activeKey.value
    );
    if (currentPane) {
      const markdownContent = convertHtmlToMarkdown(currentPane.content);
      window.electronAPI.saveFile(
        markdownContent,
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
      const fileName = extractFileNameForTabTitle(savedFilePath);
      currentPane.filePath = savedFilePath;
      currentPane.title = fileName;
    }
  });
});

// IME入力中かどうかを判定するフラグ
let isComposing = false;
// IME入力開始時にフラグを立てる
const handleCompositionStart = () => {
  isComposing = true;
};

// IME入力終了時にフラグを下ろす
const handleCompositionEnd = () => {
  isComposing = false;
};

// 新しい要素を作成し、親要素に追加する関数
function createElementAndAppend(type, attributes, parent) {
  const element = document.createElement(type);
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
  if (attributes.textContent) {
    element.textContent = attributes.textContent;
    delete attributes.textContent;
  }
  if (attributes.innerHTML) {
    element.innerHTML = attributes.innerHTML;
    delete attributes.innerHTML;
  }
  parent.appendChild(element);
  return element;
}

// カーソルを指定された要素に移動させる関数
function moveCursorToElement(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Enterキーが押されたときの処理(IME入力中は無視)
  if (event.key === "Enter" && !isComposing) {
    event.preventDefault(); // デフォルトのEnterキーの挙動を抑制
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;

      let targetNode: Element | null = null;
      if (startNode instanceof Element) {
        targetNode = startNode;
      } else if (startNode.parentNode instanceof Element) {
        targetNode = startNode.parentNode;
      }

      if (targetNode) {
        const editableDiv = targetNode.closest(".editable-content");

        if (editableDiv) {
          // ゼロ幅スペースを削除してからtextコンテンツを取得
          const textContent =
            startNode.textContent?.replace(/\u200B/g, "") || "";
          if (textContent.startsWith("# ")) {
            // targetNodeをh1タグに置き換える
            targetNode.replaceWith(
              createElementAndAppend(
                "h1",
                {
                  contenteditable: "true",
                  textContent: textContent.replace(/^#+\s/, ""),
                },
                editableDiv
              )
            );

            // h1タグの後に新しいpタグを追加してカーソルを移動
            const newP = createElementAndAppend(
              "p",
              {
                contenteditable: "true",
                innerHTML: "&#8203;",
              },
              editableDiv
            );
            moveCursorToElement(newP);
          } else {
            // 新しいpタグを追加
            const newP = createElementAndAppend(
              "p",
              {
                contenteditable: "true",
                innerHTML: "&#8203;",
              },
              editableDiv
            );
            moveCursorToElement(newP);
          }
        }
      }
    }
  }
};

// div要素のHTMLを保存する関数
const saveContent = (event: Event) => {
  const target = event.target as HTMLDivElement;
  const currentPane = panes.value.find((pane) => pane.key === activeKey.value);
  if (currentPane) {
    currentPane.content = target.innerHTML;
  }
};
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
        ref="editableContents"
      >
        <div
          class="editable-content memo-input"
          contenteditable="true"
          @keydown="handleKeyDown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @input="saveContent"
        >
          <p contenteditable="true" innerHTML="&#8203;"></p>
        </div>
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
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
