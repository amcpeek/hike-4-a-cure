import { useEffect } from "react";
import { Box, FormHelperText, InputLabel } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Toolbar } from "./Toolbar";
import { FontSize } from "./FontSize";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  error?: boolean;
  helperText?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  error,
  helperText,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          style: "max-width: 100%; height: auto;",
        },
      }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <Box>
      {label && (
        <InputLabel
          shrink
          error={error}
          sx={{ mb: 0.5, position: "relative", transform: "none" }}
        >
          {label}
        </InputLabel>
      )}
      <Box
        sx={{
          border: 1,
          borderColor: error ? "error.main" : "divider",
          borderRadius: 1,
          p: 1.5,
          "&:focus-within": {
            borderColor: error ? "error.main" : "primary.main",
            borderWidth: 2,
            p: "11px",
          },
        }}
      >
        <Toolbar editor={editor} />
        <EditorContent editor={editor} style={{ minHeight: "100px" }} />
      </Box>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </Box>
  );
}
