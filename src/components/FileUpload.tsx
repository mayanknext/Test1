import { useRef, useState } from "react";
import { Upload, FileText, AlignLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Attachment } from "@/components/vibe";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTextInput: (text: string) => void;
  onUrlInput?: (url: string) => void;
}
export const FileUpload = ({ onFileSelect, onTextInput }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const handleFile = (file: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/csv"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt")) {
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOCX, TXT, or CSV file.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };
  return <Tabs defaultValue="file" className="space-y-4">
    <TabsList className="grid grid-cols-2 w-full rounded-full bg-vb-bg-muted p-1 h-11">
      <TabsTrigger value="file" className="rounded-full gap-2 h-9 data-[state=active]:text-vb-cobalt-text"><Upload className="w-4 h-4" />Upload file</TabsTrigger>
      <TabsTrigger value="text" className="rounded-full gap-2 h-9 data-[state=active]:text-vb-cobalt-text"><AlignLeft className="w-4 h-4" />Paste text</TabsTrigger>
    </TabsList>
    <TabsContent value="file" className="space-y-4">
      <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }} className={`border border-dashed rounded-xl px-4 py-8 text-center space-y-3 ${dragActive ? "border-vb-cobalt bg-vb-cobalt-soft" : "border-vb-line-strong bg-vb-bg"}`}>
        <span className="mx-auto w-12 h-12 rounded-full bg-vb-bg-muted flex items-center justify-center"><Upload className="w-5 h-5 text-vb-ink-secondary" /></span>
        <p className="text-sm font-medium">Drop your source here</p>
        <p className="text-xs text-vb-ink-tertiary">PDF, DOCX, TXT, or CSV</p>
        <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()}>Browse files</Button>
        <input ref={fileInput} type="file" aria-label="Upload source file" className="hidden" accept=".pdf,.docx,.txt,.csv" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />
      </div>
      {selectedFile && <Attachment name={selectedFile.name} meta={`${(selectedFile.size / 1024).toFixed(1)} KB`} onRemove={() => { setSelectedFile(null); onTextInput(""); if (fileInput.current) fileInput.current.value = ""; }} />}
    </TabsContent>
    <TabsContent value="text" className="space-y-3">
      <textarea aria-label="Source text" value={textInput} onChange={(e) => { setTextInput(e.target.value); setSubmitted(false); }} placeholder="An article, research notes, a dataset…" className="vb-control w-full min-h-[190px] p-4 bg-vb-bg text-base leading-7 placeholder:text-vb-ink-tertiary resize-y" />
      <Button variant="secondary" className="w-full" disabled={!textInput.trim()} onClick={() => { onTextInput(textInput); setSelectedFile(null); setSubmitted(true); }}>{submitted ? <Check className="text-vb-success" /> : <FileText />}{submitted ? "Text added" : "Use this text"}</Button>
    </TabsContent>
  </Tabs>;
};
