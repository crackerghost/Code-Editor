import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import Navbar from "../../common/Navbar";
import { useParams } from "react-router-dom";

if (typeof MonacoEnvironment === "undefined") {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === "javascript" || label === "typescript") {
        return "/node_modules/monaco-editor/min/vs/language/typescript/tsWorker.js";
      }
      return "/node_modules/monaco-editor/min/vs/editor/editor.worker.js";
    },
  };
}

function Editor() {
  const websocket = useRef(null);
  const editorRef = useRef(null);
  const parm = useParams();
  const isRemoteUpdate = useRef(false);
  useEffect(() => {
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    };

    const editor = monaco.editor.create(document.getElementById("editor"), {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      autoClosingDelete: "always",
      cursorSmoothCaretAnimation: true,
      wordWrap: "on",
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
    });

    editorRef.current = editor;

    if (!websocket.current) {
      websocket.current = new WebSocket(
        `wss://code-editor-bmq7.onrender.com/emit`
      );
    }

    const ws = websocket.current;

    ws.onopen = () => {
      if (parm.id) {
        ws.send(JSON.stringify({ id: parm.id, code: "" })); // Send only `id` on connect
      }
    };

    ws.onmessage = (event) => {
      try {
        const receivedMessage = event.data; // Parse JSON data

        if (receivedMessage !== undefined) {
          const currentCode = editor.getValue();

          // Check if the received code differs from the current code in the editor

          // Temporarily disable the listener
          modelContentListener.dispose();

          // Update the editor content
          const currentPosition = editor.getPosition();
          editor.setValue(receivedMessage);

          // Restore the listener after update
          modelContentListener = editor.onDidChangeModelContent(() => {
            handleInput();
          });

          isRemoteUpdate.current = false;

          // Restore cursor position
          if (currentPosition) {
            editor.setPosition(currentPosition);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const handleInput = debounce(() => {
      if (isRemoteUpdate.current) {
        return;
      }
      const currentCode = editor.getValue();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ code: currentCode, id: parm.id }));
        isRemoteUpdate.current = true;
      }
    }, 1200);

    // Attach input listener
    let modelContentListener = editor.onDidChangeModelContent(() => {
      handleInput();
    });

    // Cleanup
    return () => {
      modelContentListener.dispose();
      editor.dispose();
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [parm.id]);

  return (
    <>
      <Navbar />
      <div className="w-full h-screen flex text-white">
        <div id="editor" className="w-[70%] h-full"></div>
        <div className="bg-black w-[30%] text-white text-sm items-center flex flex-col p-2 gap-8">
          <h1>Language</h1>
          <div className="w-full text-white text-sm justify-center flex pl-2 gap-8">
           
            <p className="border h-[40px] rounded-full w-[100px] cursor-pointer hover:bg-gray-900 transition-all duration-100 text-center p-2">
              JavaScript
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editor;
