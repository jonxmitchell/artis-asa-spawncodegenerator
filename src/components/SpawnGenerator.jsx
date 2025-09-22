"use client";

import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { open, save } from "@tauri-apps/api/dialog";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Spinner,
  Link,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  FileUp,
  Download,
  Coffee,
  CreditCard,
  AlertCircle,
  Info,
  BookmarkPlus,
} from "lucide-react";
import CommandList from "./CommandList";
import SavedLocations from "./SavedLocations";

const SpawnGenerator = () => {
  const [manifestPath, setManifestPath] = useState("");
  const [commands, setCommands] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("engrams");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Manifest File",
            extensions: ["txt", "*"],
          },
        ],
      });

      if (selected) {
        setManifestPath(selected);
        await generateCommands(selected);
      }
    } catch (err) {
      setError("Failed to select file: " + err.message);
    }
  };

  const handleSavedLocationSelect = async (path) => {
    setManifestPath(path);
    await generateCommands(path);
  };

  const generateCommands = async (path) => {
    setLoading(true);
    setError("");
    try {
      const result = await invoke("generate_commands", {
        manifestPath: path,
      });
      setCommands(result);
    } catch (err) {
      setError("Failed to generate commands: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!commands) return;

    try {
      const savePath = await save({
        filters: [
          {
            name: "Text File",
            extensions: ["txt"],
          },
        ],
      });

      if (savePath) {
        await invoke("save_commands_to_file", {
          path: savePath,
          commands: commands,
        });
      }
    } catch (err) {
      setError("Failed to export commands: " + err.message);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size="lg" />
          <p className="text-gray-400 mt-4">Generating commands...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Card className="mb-6 bg-danger-50">
          <CardBody className="flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-danger mt-0.5" />
            <div className="flex-1">
              <h3 className="text-danger font-medium mb-1">Error</h3>
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          </CardBody>
        </Card>
      );
    }

    if (!commands) {
      return (
        <Card className="bg-default-50">
          <CardBody className="py-8">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <Info className="w-12 h-12 text-default-400" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  No Commands Generated
                </h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Select a manifest file to generate spawn commands for your
                  ARK: Survival Ascended mods
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  color="primary"
                  startContent={<FileUp className="w-4 h-4" />}
                  onPress={handleFileSelect}
                >
                  Select File
                </Button>
                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<BookmarkPlus className="w-4 h-4" />}
                  onPress={onOpen}
                >
                  Saved Locations
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      );
    }

    return (
      <Card>
        <CardBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            aria-label="Spawn Commands"
            fullWidth
            size="lg"
          >
            <Tab
              key="engrams"
              title={
                <div className="flex items-center gap-2">
                  <span>Engrams</span>
                  <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
                    {commands.engram_names.length}
                  </span>
                </div>
              }
            >
              <CommandList
                commands={commands.engram_names}
                title="Engram Names"
                type="engram"
              />
            </Tab>
            <Tab
              key="items"
              title={
                <div className="flex items-center gap-2">
                  <span>Items</span>
                  <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
                    {commands.item_spawncodes.length}
                  </span>
                </div>
              }
            >
              <CommandList
                commands={commands.item_spawncodes}
                title="Item Spawn Commands"
                type="item"
              />
            </Tab>
            <Tab
              key="creatures"
              title={
                <div className="flex items-center gap-2">
                  <span>Creatures</span>
                  <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
                    {commands.creature_spawncodes.length}
                  </span>
                </div>
              }
            >
              <CommandList
                commands={commands.creature_spawncodes}
                title="Creature Spawn Commands"
                type="creature"
              />
            </Tab>
            <Tab
              key="tamed"
              title={
                <div className="flex items-center gap-2">
                  <span>Tamed Creatures</span>
                  <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
                    {commands.tamed_creature_spawncodes.length}
                  </span>
                </div>
              }
            >
              <CommandList
                commands={commands.tamed_creature_spawncodes}
                title="Tamed Creature Spawn Commands"
                type="tamed"
              />
            </Tab>
            <Tab
              key="buffs"
              title={
                <div className="flex items-center gap-2">
                  <span>Buffs</span>
                  <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
                    {commands.buff_blueprints.length}
                  </span>
                </div>
              }
            >
              <CommandList
                commands={commands.buff_blueprints}
                title="Buff Blueprint Paths"
                type="buff"
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                ARK: Survival Ascended Spawn Code Generator
              </h1>
              <Tooltip content="Generate spawn commands for your ASA mods">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>

            {commands && (
              <div className="flex gap-3">
                <Tooltip content="Select a new manifest file">
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<FileUp />}
                    onPress={handleFileSelect}
                    isDisabled={loading}
                  >
                    Change File
                  </Button>
                </Tooltip>

                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<BookmarkPlus className="w-4 h-4" />}
                  onPress={onOpen}
                >
                  Saved Locations
                </Button>

                <Tooltip content="Export all commands to a file">
                  <Button
                    color="secondary"
                    variant="flat"
                    startContent={<Download />}
                    onPress={handleExport}
                  >
                    Export
                  </Button>
                </Tooltip>
              </div>
            )}

            {manifestPath && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">Current file:</p>
                <code className="text-xs bg-content2 px-2 py-1 rounded">
                  {manifestPath}
                </code>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {renderContent()}

      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-400 mb-3">
          Developed by{" "}
          <Link
            href="https://discord.gg/sGgerkNSWQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            arti.artificial
          </Link>
        </p>
        <div className="flex justify-center gap-3">
          <Tooltip content="Support the development on Ko-fi">
            <Button
              as={Link}
              href="https://ko-fi.com/artiartificial"
              target="_blank"
              rel="noopener noreferrer"
              variant="flat"
              color="warning"
              startContent={<Coffee className="w-4 h-4" />}
              size="sm"
            >
              Buy me a coffee
            </Button>
          </Tooltip>
          <Tooltip content="Support via PayPal">
            <Button
              as={Link}
              href="https://paypal.me/jonlbmitchell"
              target="_blank"
              rel="noopener noreferrer"
              variant="flat"
              color="primary"
              startContent={<CreditCard className="w-4 h-4" />}
              size="sm"
            >
              Donate via PayPal
            </Button>
          </Tooltip>
        </div>
      </footer>

      <SavedLocations
        isOpen={isOpen}
        onClose={onClose}
        onLocationSelect={handleSavedLocationSelect}
      />
    </div>
  );
};

export default SpawnGenerator;
