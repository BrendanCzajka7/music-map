import os
from pathlib import Path

ROOT_DIRS = ["./backend", "./frontend"]

IGNORE_DIRS = {
    "node_modules",
    ".git",
    "__pycache__",
    "dist",
    "build",
    ".venv",
    "venv",
}

CODE_EXTS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".html",
    ".css",
    ".json",
    ".yaml",
    ".yml",
    ".env",
    ".sql",
    ".sh",
    ".md",
}

def should_ignore(path):
    return any(part in IGNORE_DIRS for part in path.parts)

def write_file(path, output_file):
    output_file.write("\n" + "=" * 80 + "\n")
    output_file.write(f"FILE: {path}\n")
    output_file.write("=" * 80 + "\n\n")

    try:
        with open(path, "r", encoding="utf-8") as f:
            output_file.write(f.read())
            output_file.write("\n")
    except Exception as e:
        output_file.write(f"[Could not read file: {e}]\n")

def process_root(root):
    root_path = Path(root)

    if not root_path.exists():
        return

    output_name = f"{root_path.name}.txt"

    with open(output_name, "w", encoding="utf-8") as output_file:
        for path in root_path.rglob("*"):
            if path.is_file() and not should_ignore(path):
                if path.suffix in CODE_EXTS:
                    write_file(path, output_file)

def main():
    for root in ROOT_DIRS:
        process_root(root)

if __name__ == "__main__":
    main()