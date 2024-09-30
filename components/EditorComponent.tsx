'use client'
import React, {useState , useRef} from 'react'
import { ModeTogglButton } from './mode-toggle-button'
import SelectLanguages from './SelectLanguages'
import Editor from '@monaco-editor/react'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"  
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { Play } from 'lucide-react'
import { codeSnippets, languageOptions } from '@/config/config'
import { selectLanguagesOptionProps } from './SelectLanguages'
import TimerComponent from './TimerComponent'


export default function EditorComponent() {
    const {theme} = useTheme();
    const [sourceCode,setSourceCode] = useState(codeSnippets['Python']);
    const [languageOption,setLanguageOption] = useState(languageOptions[0]);
    const editor_reference = useRef(null);
    console.log(languageOption)
    function handleEditorDidMount(editor:any){
        editor_reference.current = editor;
        editor.focus();
    }

    function handleOnChange(value: string|undefined){
        if (value){
            setSourceCode(value);
        }
    }

    function onSelect(value: selectLanguagesOptionProps){
        setLanguageOption(value);
        setSourceCode(codeSnippets[value.language])
    }

  return (
    <div className='min-h-screen dark:bg-black rounded-2xl shadow-2xl py-6 px-8'>
        <div className='flex items-center justify-between pb-3'>
            <h2 className="scroll-m-20 border-b text-2xl font-semibold tracking-tight first:mt-0">Mock Interview Interface</h2>
            <TimerComponent />
            <div className='flex items-center space-x-2'>
                <ModeTogglButton/>
                <div className='w-[150px]'>
                    <SelectLanguages onSelect={onSelect} selectedLanguageOption= {languageOption}/>        
                </div>    
            </div>
        </div>
        <div className='bg-slate-400 dark:bg-black p-3 rounded-2xl'>
            <ResizablePanelGroup direction="horizontal" className="max-w-full rounded-lg border md:min-w-[450px]">
                <ResizablePanel defaultSize={50} minSize={35}>
                    <Editor theme={theme === 'dark'?"vs-dark":"vs-light"}
                            onChange={handleOnChange} 
                            value={sourceCode} 
                            onMount={handleEditorDidMount} height="100vh" 
                            defaultLanguage={languageOption.language} 
                            defaultValue={sourceCode} 
                            language={languageOption.language}/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={50} minSize={35}>
                    <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
                        <div className='flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-6 py-2'>
                            <h2>Result</h2>
                            <Button size={"sm"} className='dark:bg-purple-500 dark:hover:bg-purple-600 text-slate-100 bg-slate-800 hover:bg-slate-900'>
                                <Play className="w-4 h-4 mr-2" />
                                <span>Execute Code</span>
                            </Button>
                        </div>
                        <div className='px-6'>
                            <h2 className=''>Hello</h2>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            </div>
        </div>
  )
}
