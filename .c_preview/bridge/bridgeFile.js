import { render } from "../preset/react.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/Users/Admin/ims-proj",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "frontend/src/App.jsx",
    "mapFileRelPath": "frontend/src/App.test.jsx",
    "presetName": "react",
    "workspaceFolderName": "ims-proj"
};
export const preview = () => render(getMod);
const getMod = () => import("../../frontend/src/App.test.jsx");