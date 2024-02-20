// Copyright (c) 2024 Rujuu
// This software is released under the MIT License, see LICENSE.
import { marked } from "marked";

/**
 * MarkdownコンテンツをHTML形式に変換します。
 * @param markdown Markdown形式の文字列。
 * @returns HTML形式の文字列。
 */
export const convertMarkdownToHtml = (markdown: string): string => {
  return marked.parse(markdown, { async: false });
};
