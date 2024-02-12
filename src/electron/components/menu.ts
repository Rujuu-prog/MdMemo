import {
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from "electron";
import { openFile } from "./openFile";

// メニュー定義
export const createMenu = (win: BrowserWindow) => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Open...",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            openFile(win);
          },
        },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            console.log("Save");
            win.webContents.send("save-request");
          },
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => {
            console.log("Save As");
            win.webContents.send("save-request");
          },
        },
        {
          type: "separator",
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: () => {
            console.log("Undo");
          },
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => {
            console.log("Redo");
          },
        },
        {
          type: "separator",
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          click: () => {
            if (win && win.webContents) win.webContents.cut();
          },
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          click: () => {
            if (win && win.webContents) win.webContents.copy();
          },
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          click: () => {
            if (win && win.webContents) win.webContents.paste();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.reload();
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator:
            process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            console.log("About");
          },
        },
      ],
    },
  ];

  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  return Menu.buildFromTemplate(template);
};
