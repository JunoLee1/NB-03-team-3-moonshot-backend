import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

// AI 자동완성 호출 함수
async function fetchAISuggestions(codeBeforeCursor: string) {
  const res = await fetch("/api/ai-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: codeBeforeCursor }),
  });
  const data = await res.json();
  return data.suggestions; // ["console.log('Hello')", "alert('Hi')", ...]
}

// CodeMirror용 자동완성 함수
function aiCompletion(context: CompletionContext) {
  const word = context.matchBefore(/[\w\.]+/);
  if (!word) return null;

  return {
    from: word.from,
    async options() {
      const suggestions = await fetchAISuggestions(context.state.sliceDoc(0, context.pos));
      return suggestions.map((text:string) => ({ label: text, type: "function", insertText: text }));
    }
  };
}