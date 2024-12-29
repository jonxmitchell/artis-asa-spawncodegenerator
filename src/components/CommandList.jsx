"use client";

import React from "react";
import { Button, ScrollShadow } from "@nextui-org/react";
import { Copy, CheckCircle2 } from "lucide-react";
import { writeText } from "@tauri-apps/api/clipboard";

const CommandList = ({ commands, title, type }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const copyToClipboard = async (command, index) => {
    try {
      await writeText(command);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ScrollShadow className="h-[400px]">
        <div className="space-y-2">
          {commands.map((command, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded bg-content2 hover:bg-content3 transition-colors"
            >
              <code className="text-sm flex-1 break-all mr-4">{command}</code>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => copyToClipboard(command, index)}
              >
                {copiedIndex === index ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
};

export default CommandList;
