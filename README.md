# Photoshop Smart Object Automation

A Photoshop JSX script that automatically duplicates a Smart Object into multiple selected shape layers using clipping masks.

## Features

- Duplicate one source Smart Object into multiple selected layers.
- Automatically position each copy above its corresponding shape.
- Preserve the original Smart Object size and scale (no resizing).
- Create clipping masks automatically.
- Process only the selected layers.
- Keep the original source Smart Object unchanged.
- Automatically name each copy based on its target layer.

## Requirements

- Adobe Photoshop 2024 or later.
- A Photoshop document containing separate shape layers.
- A source layer converted to a Smart Object.

## Installation

1. Download `Selected_Layers_SmartObject_Fill.jsx` from this repository.
2. Open your PSD in Photoshop.
3. Rename your source Smart Object layer to exactly:

   `DESIGN SOURCE`

## How to Use

1. Select your `DESIGN SOURCE` Smart Object layer.
2. Hold `Ctrl` (Windows) or `Cmd` (Mac).
3. Click all the shape layers you want to fill in the Layers panel.
4. Go to **File → Scripts → Browse**.
5. Select `Selected_Layers_SmartObject_Fill.jsx`.
6. Confirm the operation.

The script will automatically:

- Duplicate the source Smart Object.
- Place one copy above each selected shape layer.
- Center each copy over its corresponding shape.
- Preserve the original Smart Object dimensions.
- Apply a clipping mask to each copy.

## Important Notes

- Only selected eligible layers are processed.
- The source layer must be named `DESIGN SOURCE`.
- The source Smart Object is not modified.
- The Smart Object is not resized or stretched.
- Each duplicate retains the original size and scale.
- Save a backup of your PSD before running the script.

## Compatibility

Developed for Adobe Photoshop using JSX (ExtendScript).

## License

MIT License (if you choose to distribute this project under the MIT License).
