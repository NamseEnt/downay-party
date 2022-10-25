import electron from "electron";

electron.app.on("ready", () => {
  const window = new electron.BrowserWindow({});
  window.loadURL("http://localhost:1234");
});
