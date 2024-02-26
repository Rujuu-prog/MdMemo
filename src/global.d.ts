// Copyright (c) 2024 Rujuu
// This software is released under the MIT License, see LICENSE.
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
  onNewTabRequested: (callback: () => void) => void;
}

declare global {
  // グローバルの Window オブジェクトを拡張
  interface Window {
    electronAPI: IElectronAPI;
  }
}
