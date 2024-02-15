/**
 * Extracts the file name from a given file path or uses a default title if the file path is `false`,
 * empty, or incomplete. This function is designed for use in UI components, such as tabs, where a file name
 * is displayed as a title. It ensures a meaningful title is always available, even when the file path
 * is not provided or is invalid.
 *
 * @param filePath - The full path of the file to be parsed, or `false` if no file path is available.
 *                   Example: "/path/to/myfile.txt"
 * @param defaultFileName - The default title to use if a file name cannot be extracted from the `filePath`,
 *                          or if `filePath` is `false`. Defaults to "New Memo".
 * @returns The parsed file name if `filePath` is a valid string, or the `defaultFileName` otherwise.
 */
const extractFileNameForTabTitle = (
  filePath: string | false,
  defaultFileName: string = "New Memo"
): string => {
  // Return the defaultFileName if filePath is false or an empty string
  if (!filePath) {
    return defaultFileName;
  }

  // Extract and return the file name from filePath, or defaultFileName if extraction fails
  return filePath.split("/").pop() || defaultFileName;
};

export default extractFileNameForTabTitle;
