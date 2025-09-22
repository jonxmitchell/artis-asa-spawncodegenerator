use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{self, BufRead, BufReader};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct SpawnCommands {
    pub engram_names: Vec<String>,
    pub item_spawncodes: Vec<String>,
    pub creature_spawncodes: Vec<String>,
    pub tamed_creature_spawncodes: Vec<String>,
    pub buff_blueprints: Vec<String>,
}

pub struct SpawnGenerator;

impl SpawnGenerator {
    pub fn new() -> Self {
        SpawnGenerator
    }

    pub fn generate_spawn_commands(&self, manifest_path: &Path) -> io::Result<SpawnCommands> {
        let blueprint_entries = self.parse_manifest_file(manifest_path)?;
        let (engram_entries, item_entries, creature_entries, buff_entries) =
            self.filter_relevant_entries(&blueprint_entries);

        let mut commands = SpawnCommands {
            engram_names: Vec::new(),
            item_spawncodes: Vec::new(),
            creature_spawncodes: Vec::new(),
            tamed_creature_spawncodes: Vec::new(),
            buff_blueprints: Vec::new(),
        };

        // Process engram names
        for entry in engram_entries {
            let engram_name = Path::new(&entry)
                .file_name()
                .and_then(|n| n.to_str())
                .map(|s| s.replace(".uasset", "_C"))
                .unwrap_or_default();
            commands.engram_names.push(engram_name);
        }

        // Process item spawncodes
        for entry in &item_entries {
            if entry.contains("PrimalItem") {
                let blueprint_path = entry
                    .replace("ShooterGame/Mods/", "")
                    .replace("Content/", "")
                    .replace(".uasset", "");
                let item_name = Path::new(&blueprint_path)
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or_default();
                let spawn_command =
                    format!("cheat giveitem \"Blueprint'/{blueprint_path}.{item_name}'\" 1 0 0");
                commands.item_spawncodes.push(spawn_command);
            }
        }

        // Process creature spawncodes
        for entry in &creature_entries {
            let blueprint_path = entry
                .replace("ShooterGame/Mods/", "")
                .replace("Content/", "")
                .replace(".uasset", "");
            let spawn_command = format!(
                "cheat SpawnDino \"Blueprint'/{blueprint_path}.{}\'\" 500 0 0 120",
                Path::new(&blueprint_path)
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or_default()
            );
            commands.creature_spawncodes.push(spawn_command);
        }

        // Process tamed creature spawncodes
        for entry in &creature_entries {
            let tamed_command = format!(
                "admincheat GMSummon \"{}\" 120",
                Path::new(entry)
                    .file_name()
                    .and_then(|n| n.to_str())
                    .map(|s| s.replace(".uasset", "_C"))
                    .unwrap_or_default()
            );
            commands.tamed_creature_spawncodes.push(tamed_command);
        }

        // Process buff blueprints
        for entry in &buff_entries {
            let blueprint_path = entry
                .replace("ShooterGame/Mods/", "")
                .replace("Content/", "")
                .replace(".uasset", "");
            let buff_name = Path::new(&blueprint_path)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or_default();
            let buff_blueprint = format!("Blueprint'/{blueprint_path}.{buff_name}'");
            commands.buff_blueprints.push(buff_blueprint);
        }

        Ok(commands)
    }

    fn parse_manifest_file(&self, manifest_path: &Path) -> io::Result<Vec<String>> {
        let file = File::open(manifest_path)?;
        let reader = BufReader::new(file);
        let mut blueprint_entries = Vec::new();

        for line in reader.lines() {
            if let Ok(line) = line {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if let Some(first) = parts.first() {
                    if first.ends_with(".uasset") {
                        blueprint_entries.push(first.to_string());
                    }
                }
            }
        }

        Ok(blueprint_entries)
    }

    fn filter_relevant_entries(
        &self,
        entries: &[String],
    ) -> (Vec<String>, Vec<String>, Vec<String>, Vec<String>) {
        let mut engram_entries = Vec::new();
        let mut item_entries = Vec::new();
        let mut creature_entries = Vec::new();
        let mut buff_entries = Vec::new();

        for entry in entries {
            if entry.contains("EngramEntry") {
                engram_entries.push(entry.clone());
            } else if entry.contains("PrimalItem") {
                item_entries.push(entry.clone());
            } else if entry.contains("Character_BP") {
                creature_entries.push(entry.clone());
            } else if entry.contains("/Buffs/") && entry.contains("Buff_") {
                buff_entries.push(entry.clone());
            }
        }

        (engram_entries, item_entries, creature_entries, buff_entries)
    }
}
