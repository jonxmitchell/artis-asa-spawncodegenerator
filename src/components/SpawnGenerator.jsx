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
} from "@nextui-org/react";
import { FileUp, Download, Coffee, CreditCard } from "lucide-react";
import CommandList from "./CommandList";

const SpawnGenerator = () => {
  const [manifestPath, setManifestPath] = useState("");
  const [commands, setCommands] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        generateCommands(selected);
      }
    } catch (err) {
      setError("Failed to select file: " + err.message);
    }
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

  return (
    <div className="p-1 mx-auto">
      <Card className="mb-3">
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold mb-4">
              ARK: Survival Ascended Spawn Code Generator
            </h1>
            <div className="flex gap-4">
              <Button
                color="primary"
                variant="solid"
                startContent={<FileUp />}
                onPress={handleFileSelect}
                isDisabled={loading}
              >
                Select Manifest File
              </Button>
              {commands && (
                <Button
                  color="secondary"
                  variant="solid"
                  startContent={<Download />}
                  onPress={handleExport}
                >
                  Export
                </Button>
              )}
            </div>
            {manifestPath && (
              <p className="text-sm text-gray-500">
                Selected file: {manifestPath}
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {error && (
        <Card className="mb-6 bg-danger-50">
          <CardBody>
            <p className="text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      )}

      {commands && !loading && (
        <Card>
          <CardBody>
            <Tabs aria-label="Spawn Commands" fullWidth>
              <Tab key="engrams" title="Engrams">
                <CommandList
                  commands={commands.engram_names}
                  title="Engram Names"
                  type="engram"
                />
              </Tab>
              <Tab key="items" title="Items">
                <CommandList
                  commands={commands.item_spawncodes}
                  title="Item Spawn Commands"
                  type="item"
                />
              </Tab>
              <Tab key="creatures" title="Creatures">
                <CommandList
                  commands={commands.creature_spawncodes}
                  title="Creature Spawn Commands"
                  type="creature"
                />
              </Tab>
              <Tab key="tamed" title="Tamed Creatures">
                <CommandList
                  commands={commands.tamed_creature_spawncodes}
                  title="Tamed Creature Spawn Commands"
                  type="tamed"
                />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      )}

      {/* Credits and Donation Section */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400 mb-2">
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
        <div className="flex justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default SpawnGenerator;
