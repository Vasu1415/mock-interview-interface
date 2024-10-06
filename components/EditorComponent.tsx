"use client";
import React, { useRef, useState } from "react";
import { ModeToggleButton } from "./mode-toggle-button";
import SelectLanguages, { selectedLanguageOptionProps } from "./SelectLanguages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor, { Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Loader, Play, TriangleAlert } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import toast from "react-hot-toast";
import TimerComponent from "./TimerComponent";

export interface CodeSnippetsProps {
  [key: string]: string;
}

export default function EditorComponent() {
  const { theme } = useTheme();
  const [sourceCode, setSourceCode] = useState(codeSnippets["python"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const editorRef = useRef<Monaco | null>(null);

  function handleEditorDidMount(editor: Monaco) {
    editorRef.current = editor;
    editor.getModel()?.setValue(sourceCode); // Load the initial source code into the editor
    editor.focus();
  }

  function handleOnChange(value: string | undefined) {
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
      setError(false);
      toast.success("Compiled Successfully");
    } catch (error) {
      setError(true);
      setLoading(false);
      toast.error("Failed to compile the Code");
    }
  }

  return (
    <div className="min-h-screen bg-slate-300 dark:bg-black rounded-2xl shadow-2xl py-6 px-8">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
          Mock Interview Interface
        </h2>
        <TimerComponent />
        <div className="flex items-center space-x-2">
          <ModeToggleButton />
          <div className="w-[230px]">
            <SelectLanguages
              onSelect={onSelect}
              selectedLanguageOption={languageOption}
            />
          </div>
        </div>
      </div>
      {/* EDITOR */}
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
              onChange={handleOnChange}
              language={languageOption.language}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="space-y-3 bg-slate-300 dark:bg-black min-h-screen">
              <div className="flex items-center justify-between bg-slate-300 dark:bg-black px-6 py-2">
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
              <div className="px-6 space-y-2">
                {error ? (
                  <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                    <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-xs">
                      Failed to Compile the Code, Please try again!
                    </p>
                  </div>
                ) : (
                  <>
                    {output.map((item) => (
                      <p className="text-sm font-bold" key={item}>
                        {item}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
