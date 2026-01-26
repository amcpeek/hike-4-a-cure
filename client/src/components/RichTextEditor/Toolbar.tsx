import { useRef, useState } from "react";
import {
  IconButton,
  Stack,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  LinkOff,
  FormatSize,
  FormatColorText,
  Image as ImageIcon,
} from "@mui/icons-material";
import type { Editor } from "@tiptap/react";
import { brandColors, fontSizes } from "../../theme";
import { ToolbarMenu } from "./ToolbarMenu";
import { uploadFile } from "../../api/upload";

interface ToolbarProps {
  editor: Editor;
}

const FONT_SIZE_OPTIONS = [
  { label: "Small", value: fontSizes.small },
  { label: "Normal", value: null },
  { label: "Large", value: fontSizes.large },
  { label: "Extra Large", value: fontSizes.extraLarge },
];

const COLOR_OPTIONS = [
  { label: "Maroon (Brand)", value: brandColors.maroon },
  { label: "Dark Gray (Brand)", value: brandColors.darkGray },
  { label: "Black", value: brandColors.black },
  { label: "Default", value: null },
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function Toolbar({ editor }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Invalid file type. Please upload JPEG, PNG, GIF, or WebP.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const currentFontSize = editor.getAttributes("textStyle").fontSize || null;
  const currentColor = editor.getAttributes("textStyle").color || null;

  const handleFontSizeSelect = (value: string | null) => {
    if (value) {
      editor.chain().focus().setFontSize(value).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
  };

  const handleColorSelect = (value: string | null) => {
    if (value) {
      editor.chain().focus().setColor(value).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        pb: 1,
        mb: 1,
        flexWrap: "wrap",
        gap: 0.5,
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBold fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Italic">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalic fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <ToolbarMenu
        tooltip="Font Size"
        icon={<FormatSize fontSize="small" />}
        options={FONT_SIZE_OPTIONS}
        currentValue={currentFontSize}
        onSelect={handleFontSizeSelect}
        showSizePreview
      />

      <ToolbarMenu
        tooltip="Text Color"
        icon={<FormatColorText fontSize="small" />}
        options={COLOR_OPTIONS}
        currentValue={currentColor}
        onSelect={handleColorSelect}
        showColorSwatch
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Bullet List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulleted fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Numbered List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumbered fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Add Link">
        <IconButton
          size="small"
          onClick={setLink}
          color={editor.isActive("link") ? "primary" : "default"}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {editor.isActive("link") && (
        <Tooltip title="Remove Link">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <LinkOff fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <Tooltip title="Insert Image">
        <span>
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <CircularProgress size={18} />
            ) : (
              <ImageIcon fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
