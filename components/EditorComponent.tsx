"use client";
import React, { useRef, useState } from "react";
import { ModeToggleButton } from "./mode-toggle-button";
import SelectLanguages, {
  selectedLanguageOptionProps,
} from "./SelectLanguages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Loader, Play } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import TimerComponent from "./TimerComponent";
import * as monaco from 'monaco-editor';
export interface CodeSnippetsProps {
  [key: string]: string;
}
export default function EditorComponent() {
  const { theme } = useTheme();
  const [sourceCode, setSourceCode] = useState(codeSnippets["python"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState([]);
  const [error, seterror] = useState(false);

  const editorRef = useRef(null);
  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.focus();
  }
  function handleOnchange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
    }
  }
  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
  }

  async function executeCode() {
    setLoading(true);
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: sourceCode,
        },
      ],
    };
    try {
      const result = await compileCode(requestData);
      setOutput(result.run.output.split("\n"));
      setLoading(false);
      seterror(false);

    } catch (error) {
      seterror(true);
      setLoading(false);
      console.log(error)
    }
  }
  return (
    <div className="min-h-screen bg-slate-300 dark:bg-black rounded-2xl shadow-2xl py-6 px-8">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
          Mock Interview Interface
        </h2>
        <TimerComponent/>
        <div className="flex items-center space-x-2 ">
          <ModeToggleButton />
          <div className="w-[230px]">
            <SelectLanguages
              onSelect={onSelect}
              selectedLanguageOption={languageOption}
            />
          </div>
        </div>
      </div>
      {/* EDITOR  */}
      <div className="bg-slate-300 dark:bg-black p-3 rounded-2xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border dark:bg-black"
        >
          <ResizablePanel defaultSize={50} minSize={35}>
            <Editor
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              height="100vh"
              defaultLanguage={languageOption.language}
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              value={sourceCode}
              onChange={handleOnchange}
              language={languageOption.language}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="space-y-3 bg-slate-300 dark:bg-black min-h-screen">
              <div className="flex items-center justify-between  bg-slate-300 dark:bg-black px-6 py-2">
                <h2 className="font-bold">Code Results</h2>
                {loading ? (
                  <Button
                    disabled
                    size={"sm"}
                    className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-black "
                  >
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span className="font-bold">Fetching Results...</span>
                  </Button>
                ) : (
                  <Button
                    onClick={executeCode}
                    size={"sm"}
                    className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-black "
                  >
                    <Play className="w-4 h-4 mr-2" />
                    <span className="font-bold">Execute Code</span>
                  </Button>
                )}
              </div>
              <div className=" px-6 space-y-2">
                  <>
                    {output.map((item) => {
                      return (
                        <p className="text-sm font-bold" key={item}>
                          {item}
                        </p>
                      );
                    })}
                  </>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}