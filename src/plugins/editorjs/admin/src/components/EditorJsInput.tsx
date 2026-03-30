import { useRef, useEffect, useCallback, useState } from "react";
import { useField } from "@strapi/strapi/admin";
import EditorJS, { type OutputData, type EditorConfig } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import CodeTool from "@editorjs/code";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Warning from "@editorjs/warning";
import { Field } from "@strapi/design-system";

const EDITOR_TOOLS: EditorConfig["tools"] = {
  header: {
    class: Header as any,
    inlineToolbar: true,
    config: {
      levels: [2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },
  list: {
    class: List as any,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph as any,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool as any,
    config: {
      uploader: {
        async uploadByFile(file: File) {
          const formData = new FormData();
          formData.append("files", file);

          const token = JSON.parse(
            sessionStorage.getItem("jwtToken") ||
              localStorage.getItem("jwtToken") ||
              '""'
          );

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const data = await response.json();

          if (data && data.length > 0) {
            return {
              success: 1,
              file: {
                url: data[0].url,
              },
            };
          }

          return { success: 0 };
        },
        async uploadByUrl(url: string) {
          return {
            success: 1,
            file: { url },
          };
        },
      },
    },
  },
  embed: {
    class: Embed as any,
    config: {
      services: {
        youtube: true,
        vimeo: true,
        codepen: true,
        twitter: true,
        instagram: true,
      },
    },
  },
  table: {
    class: Table as any,
    inlineToolbar: true,
  },
  quote: {
    class: Quote as any,
    inlineToolbar: true,
  },
  delimiter: Delimiter as any,
  code: CodeTool as any,
  checklist: {
    class: Checklist as any,
    inlineToolbar: true,
  },
  marker: {
    class: Marker as any,
  },
  inlineCode: {
    class: InlineCode as any,
  },
  linkTool: {
    class: LinkTool as any,
  },
  warning: {
    class: Warning as any,
    inlineToolbar: true,
  },
};

interface EditorJsInputProps {
  name: string;
  attribute: {
    customFieldConfig?: {
      placeholder?: string;
    };
  };
}

export const EditorJsInput = ({ name, attribute }: EditorJsInputProps) => {
  const { onChange, value, error } = useField(name);
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const placeholder =
    attribute?.customFieldConfig?.placeholder || "Start writing...";

  const handleChange = useCallback(async () => {
    if (!editorRef.current) return;
    try {
      const outputData = await editorRef.current.save();
      onChange(name, outputData);
    } catch {
      // save failed silently
    }
  }, [onChange, name]);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    let initialData: OutputData | undefined;
    if (value && typeof value === "object" && "blocks" in (value as any)) {
      initialData = value as unknown as OutputData;
    }

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: EDITOR_TOOLS,
      data: initialData,
      placeholder,
      minHeight: 200,
      onChange: () => {
        handleChange();
      },
      onReady: () => {
        setReady(true);
      },
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Field.Root name={name} error={error}>
      <Field.Label>
        {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")}
      </Field.Label>
      <div
        ref={holderRef}
        style={{
          border: "1px solid #dcdce4",
          borderRadius: "4px",
          padding: "12px",
          minHeight: "250px",
          background: "#fff",
          opacity: ready ? 1 : 0.5,
        }}
      />
      {error && <Field.Error />}
    </Field.Root>
  );
};
