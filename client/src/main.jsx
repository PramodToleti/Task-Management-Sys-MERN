import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { registerLicense } from "@syncfusion/ej2-base"

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCdkx3QHxbf1xzZFRMYF1bRH5PIiBoS35RdUVkWHlfc3RURmlaUUd2"
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
