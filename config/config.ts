import { CodeSnippetsProps } from "@/components/EditorComponent";

export const languageOptions = [
  {
    language: "python",
    version: "3.10.0",
    aliases: ["py", "py3", "python3", "python3.10"],
  },
  {
    language: "java",
    version: "15.0.2",
    aliases: [],
  },
];

export const codeSnippets: CodeSnippetsProps = {
  python: `def helloWorld():
    return 'Hello World!'
print(helloWorld())`,

  java: `public class Main {
    public static String helloWorld() {
        return "Hello World!";
    }
    public static void main(String[] args) {
        System.out.println(helloWorld());
    }
}`, 
};