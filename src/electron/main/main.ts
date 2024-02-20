// Copyright (c) 2024 Rujuu
// This software is released under the MIT License, see LICENSE.
import { join } from "path";
import { app, BrowserWindow, Menu, ipcMain, dialog } from "electron";
import { createMenu } from "../components/menu";
import { saveFile } from "../components/saveFile";

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // titleBarStyle: "hidden",
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
    },
  });

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools(); // Open the DevTools.
  } else {
    mainWindow.loadFile(join(__dirname, "../../index.html"));
  }
  // アプリケーションメニューへ "menu" を適用する
  Menu.setApplicationMenu(createMenu(mainWindow));
  // mainWindow.loadURL( //this doesn't work on macOS in build and preview mode
  //     isDev ?
  //     'http://localhost:3000' :
  //     join(__dirname, '../../index.html')
  // );
}

ipcMain.handle("open-file-dialog", async (event) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    const { filePaths } = await dialog.showOpenDialog(win, {
      properties: ["openFile", "showHiddenFiles"],
      filters: [
        {
          name: "テキストファイル",
          extensions: ["txt", "text", "md", "markdown"],
        },
      ],
    });
    return filePaths[0]; // 選択された最初のファイルパスを返す
  }
});

ipcMain.handle("save-file", async (event, data, filePath) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;
  return await saveFile(win, data, filePath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
