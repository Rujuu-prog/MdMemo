export interface IElectronAPI {
  openFileDialog: (
    listener: (
      _e: Electron.IpcRendererEvent,
      filepath: string,
      data: string
    ) => void
  ) => Electron.IpcRenderer;
  saveFile: (data: string, filePath?: string) => Promise<string | undefined>;
  onSaveRequest: (callback: () => void) => void;
  onFileSaved: (
    callback: (_e: Electron.IpcRendererEvent, savedFilePath: string) => void
  ) => void;
}

declare global {
  // グローバルの Window オブジェクトを拡張
  interface Window {
    electronAPI: IElectronAPI;
  }
}
