import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFileDialog: (
    listener: (_e: IpcRendererEvent, filepath: string, data: string) => void
  ) => ipcRenderer.on("menu-open", listener),
  saveFile: (data: string, filePath?: string) =>
    ipcRenderer.invoke("save-file", data, filePath),
  onSaveRequest: (callback: any) => ipcRenderer.on("save-request", callback),
  onFileSaved: (callback: any) => ipcRenderer.on("file-saved", callback),
});

// import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// contextBridge.exposeInMainWorld("electronAPI", {
//   openFileDialog: () => ipcRenderer.send("open-file-dialog"),
// });
