// import { CodeSnippetsProps } from "@/components/EditorComponent";

export const languageOptions = [
  {
    language: "Python",
    version: "3.10.0",
    aliases: ["py", "py3", "python3", "python3.10"],
  },
  {
    language: "Java",
    version: "15.0.2",
    aliases: [],
  },
];

export const codeSnippets = {
  Python: `def sum(a, b):
    return a + b
print(sum(3, 4))`,
  Java: `public class Main {
    public static int sum(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        System.out.println(sum(3, 4));
    }
}`
};