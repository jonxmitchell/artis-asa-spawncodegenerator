// src/hooks/useContextMenu.js
"use client";

import { useEffect } from "react";

export function useContextMenu() {
	useEffect(() => {
		if (typeof window === "undefined") return; // Guard clause for SSR

		const { writeText, readText } = require("@tauri-apps/api/clipboard");
		const { showMenu } = require("tauri-plugin-context-menu");

		const handleContextMenu = async (e) => {
			e.preventDefault();

			await showMenu({
				pos: { x: e.clientX, y: e.clientY },
				theme: "dark",
				items: [
					{
						label: "Cut",
						event: async () => {
							const selection = document.getSelection();
							if (selection) {
								await writeText(selection.toString());
								document.execCommand("delete");
							}
						},
					},
					{
						label: "Copy",
						event: async () => {
							const selection = document.getSelection();
							if (selection) {
								await writeText(selection.toString());
							}
						},
					},
					{
						label: "Paste",
						event: async () => {
							const text = await readText();
							if (text) {
								document.execCommand("insertText", false, text);
							}
						},
					},
					{
						label: "Select All",
						event: () => {
							document.execCommand("selectAll");
						},
					},
				],
			});
		};

		document.addEventListener("contextmenu", handleContextMenu);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
		};
	}, []);
}
