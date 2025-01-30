"use client";

import React from "react";
import { Button, ScrollShadow, Input, Tooltip } from "@nextui-org/react";
import { Copy, CheckCircle2, Search, FileCode2 } from "lucide-react";
import { writeText } from "@tauri-apps/api/clipboard";

const CommandList = ({ commands, title, type }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const [copiedBlueprintIndex, setCopiedBlueprintIndex] = React.useState(null);
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

  const extractAndCopyBlueprint = async (command, index) => {
    try {
      const blueprintMatch = command.match(/Blueprint'\/[^']+'/);
      if (blueprintMatch) {
        const blueprint = blueprintMatch[0];
        await writeText(blueprint);
        setCopiedBlueprintIndex(index);
        setTimeout(() => setCopiedBlueprintIndex(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy blueprint:", err);
    }
  };

  const shouldShowBlueprintButton = (command) => {
    return command.includes("Blueprint'/");
  };

  return (
    <div className="h-[calc(57vh-61px)] flex flex-col py-4]">
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
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {shouldShowBlueprintButton(command) && (
                  <Tooltip content="Copy Blueprint Path">
                    <Button
                      isIconOnly
                      className="bg-content4/50 hover:bg-content4"
                      size="sm"
                      onPress={() => extractAndCopyBlueprint(command, index)}
                      aria-label="Copy blueprint path"
                    >
                      {copiedBlueprintIndex === index ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <FileCode2 className="w-4 h-4" />
                      )}
                    </Button>
                  </Tooltip>
                )}
                <Tooltip content="Copy Full Command">
                  <Button
                    isIconOnly
                    className="bg-content4/50 hover:bg-content4"
                    size="sm"
                    onPress={() => copyToClipboard(command, index)}
                    aria-label="Copy command"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </Tooltip>
              </div>
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
