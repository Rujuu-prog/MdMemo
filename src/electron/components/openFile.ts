import {
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from "electron";
import fs from "fs";

export const openFile = async (win: BrowserWindow) => {
  return dialog
    .showOpenDialog(win, {
      properties: ["openFile", "showHiddenFiles"],
      title: "ファイルを選択する",
      filters: [
        {
          name: "テキストファイル",
          extensions: ["txt", "text", "md", "markdown"],
        },
      ],
    })
    .then((result) => {
      if (result.canceled) return;

      const filePath = result.filePaths[0];

      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.log(`Error reading file: ${err}`);
          return;
        }

        // レンダラープロセスへファイルのフルパスとファイルの中身を送信
        win.webContents.send("menu-open", filePath, data);
      });
    })
    .catch((err) => console.log(`Error: ${err}`));
};
