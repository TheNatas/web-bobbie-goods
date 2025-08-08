# Bobbie Goods Coloring Application

A lightweight, interactive web application for coloring bobbie goods with simple paint tools. Built with React, TypeScript, and Vite for optimal performance.

## Features

- 🎨 **Interactive Painting**: Click and drag to paint on bobbie goods images
- 🎯 **Customizable Tools**: Choose from a wide range of colors and brush sizes
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 💾 **Download Artwork**: Save your finished artwork as PNG images
- 🔄 **Clear Canvas**: Start over anytime with the clear button
- ⚡ **Lightweight**: Fast loading and smooth performance

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-bobbie-goods
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Choose a Color**: Use the color picker to select your desired color
2. **Adjust Brush Size**: Use the slider to set the brush size (1-20px)
3. **Start Painting**: Click and drag on the canvas to paint
4. **Clear Canvas**: Use the "Clear" button to start over
5. **Download**: Click "Download" to save your artwork as a PNG file

## Project Structure

```
web-bobbie-goods/
├── public/
│   └── images/
│       └── sample-bobbie.svg    # Sample bobbie goods image
├── src/
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── index.css                # Global styles
│   └── main.tsx                 # Application entry point
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Canvas API**: HTML5 Canvas for drawing functionality
- **CSS3**: Modern styling with gradients and animations

## Customization

### Adding New Images

1. Place your bobbie goods images in the `public/images/` directory
2. Update the `currentImage` state in `App.tsx` to point to your new image
3. Images should be in SVG, PNG, or JPG format

### Modifying Colors

The application uses a beautiful gradient theme. You can customize colors by modifying the CSS variables in `App.css`.

### Extending Features

The application is built with extensibility in mind. You can easily add:
- More brush types (spray, fill, etc.)
- Undo/redo functionality
- Image filters and effects
- Multiple canvas layers

## Future Enhancements

- [ ] Multiple bobbie goods templates
- [ ] Undo/redo functionality
- [ ] Different brush types (spray, fill, etc.)
- [ ] Save/load artwork functionality
- [ ] Social sharing features
- [ ] Integration with external image APIs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
