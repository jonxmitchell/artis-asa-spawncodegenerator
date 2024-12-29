# Arti's ARK: Survival Ascended Spawn Code Generator

A desktop application built with Tauri + Next.js that generates spawn codes for ARK: Survival Ascended mods. This tool helps mod developers and server administrators easily generate and manage spawn codes for items, creatures, and engrams.

## Features

- 🎮 Generate spawn codes for:
  - Items
  - Creatures
  - Tamed Creatures
  - Engrams
- 🔍 Search functionality for easy code finding
- 📋 One-click copy to clipboard
- 💾 Export all commands to a file
- 🌙 Dark mode interface
- 🚀 Fast and lightweight

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (Windows only)

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/artis-asa-spawncodegenerator.git
cd artis-asa-spawncodegenerator
```

2. Install dependencies:

```bash
npm install
```

3. Generate Cargo.lock:

```bash
cargo generate-lockfile
```

4. Run the development server:

```bash
npm run tauri dev
```

### Building for Production

1. Build the application:

```bash
npm run tauri build
```

The built application will be available in the `src-tauri/target/release` directory.

## Usage

1. Launch the application
2. Click "Select Manifest File" and choose your mod's manifest file
3. The application will generate spawn codes in four categories:
   - Engrams
   - Items
   - Creatures
   - Tamed Creatures
4. Use the search bar to filter commands
5. Click the copy button next to any command to copy it to your clipboard
6. Use the Export button to save all commands to a text file

## Built With

- [Tauri](https://tauri.app/) - Desktop application framework
- [Next.js](https://nextjs.org/) - React framework
- [NextUI](https://nextui.org/) - UI component library
- [Rust](https://www.rust-lang.org/) - Backend implementation
- [TailwindCSS](https://tailwindcss.com/) - CSS framework

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Join our [Discord Server](https://discord.gg/sGgerkNSWQ)
- Support the development:
  - [Buy me a coffee](https://ko-fi.com/artiartificial)
  - [PayPal](https://paypal.me/jonlbmitchell)

## Acknowledgments

- This project was inspired by Andreas Hagström's [SpawnCodeGenerator](https://github.com/andreashagstrom/SpawnCodeGenerator) for ARK: Survival Evolved

## Contact

- Discord: arti.artificial
- GitHub: [Your GitHub Profile](https://github.com/yourusername)

---

Made with ❤️ by arti.artificial
