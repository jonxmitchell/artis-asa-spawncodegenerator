"use client";

import React from "react";
import { Button, ScrollShadow, Input } from "@nextui-org/react";
import { Copy, CheckCircle2, Search } from "lucide-react";
import { writeText } from "@tauri-apps/api/clipboard";

const CommandList = ({ commands, title, type }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredCommands, setFilteredCommands] = React.useState(commands);

  React.useEffect(() => {
    const filtered = commands.filter((command) =>
      command.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommands(filtered);
  }, [searchQuery, commands]);

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
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          className="w-64"
          placeholder="Search commands..."
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
        />
        <div className="text-sm text-gray-400">
          {filteredCommands.length} commands found
        </div>
      </div>

      <ScrollShadow className="flex-1">
        <div className="space-y-2 pr-2">
          {filteredCommands.map((command, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-content2/50 hover:bg-content3/50 transition-all duration-200 group border border-content3/50"
            >
              <code className="text-sm flex-1 break-all mr-4 font-mono">
                {command}
              </code>
              <Button
                isIconOnly
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-content4/50 hover:bg-content4"
                size="sm"
                onClick={() => copyToClipboard(command, index)}
                aria-label="Copy command"
              >
                {copiedIndex === index ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="flex items-center justify-center p-8 text-gray-400">
              No commands found matching your search
            </div>
          )}
        </div>
      </ScrollShadow>
    </div>
  );
};

export default CommandList;
