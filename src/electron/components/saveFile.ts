// src/electron/saveFile.ts
import { dialog, BrowserWindow } from "electron";
import fs from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);

export async function saveFile(
  win: BrowserWindow,
  data: string,
  filePath?: string
): Promise<string | undefined> {
  let file = filePath;
  if (!file) {
    const { canceled, filePath: chosenPath } = await dialog.showSaveDialog(
      win,
      {
        // ダイアログオプション...
      }
    );
    if (canceled || !chosenPath) return undefined;
    file = chosenPath;
  }

  await writeFileAsync(file, data);
  // fileが保存されたことをレンダラープロセスにfilepathを渡して通知
  win.webContents.send("file-saved", file);
  return file;
}
