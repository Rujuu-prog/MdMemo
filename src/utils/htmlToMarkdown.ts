// Copyright (c) 2024 Rujuu
// This software is released under the MIT License, see LICENSE.
// turndownをインポート（HTMLからMarkdownへの変換に使用）
import TurndownService from "turndown";

/**
 * HTMLコンテンツをMarkdown形式に変換します。
 * @param html HTML形式の文字列。
 * @returns Markdown形式の文字列。
 */
export const convertHtmlToMarkdown = (html: string): string => {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
};
