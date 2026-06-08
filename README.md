# Image Editor

This application is an image editor that uses WebAssembly as the executor of image processing in the application. The purpose of this application is to explore WebAssembly and is my own final assignment in college. This project provides several editing features, or more precisely, filtering because it is still unable to combine several editing results between algorithms. These features include:
- Color Transfer: This feature simply transfers the color palette from one image to another.
- Sharpen: Manipulates images by sharpening objects within the image.
- Color Adjustment: This feature includes algorithms for manipulating saturation, temperature, and tint.
- Light Adjustment: Like the previous feature, this feature uses two image processing algorithms: exposure and contrast.

This application runs entirely on the client. The WebAssembly component is packaged in [npm](https://npm.com). You can check out the package at [link](https://npm.com/package/rust-editor).

I also blogged about how to build a WebAssembly package using Rust at the following link [Build WASM package with Rust](https://porto.alfazh.dev/blog/built-wasm-package-with-rust/)

## Tech stack

NextJs(15)
TailwindCSS
ShadncUI
Rust
WebAssembly

## How to start

clone this repository:

```bash
git clone https://github.com/alfazh123/image-editor.git

cd image-editor
```

then install dependencies by run command bellow:

```bash
npm install
```

then running the application:

```bash
npm run dev
```

## Reason of this application

From the previous statement, the application aims for my final project in college, in the current project I only implemented WebAssembly as a runtime or executor of image processing carried out in the application. However, in this final project, the goal is to compare two technologies to find out the advantages and disadvantages of the architecture used, the technology I use besides using WebAssembly is [Actix Web] (https://actix.rs), in the application has several features including:
- Image editor (features previously explained)
- Execution time recording: each time image processing is performed, the execution time, the type of algorithm used, the method used, and the internet speed (if used) are recorded.
- Speed ​​test: This speed test is used to obtain internet speed values ​​when benchmarking using different internet speeds for each test.
- Benchmark page provides an informative display of the test results. This page displays the lowest and highest average internet speeds, the internet speed (if used), and the time required for each interaction.

For the current application, there is no longer an implementation on Actix Web, but if you are interested and want to try it, you can see the build release with the title [Benchmark Editor App](https://github.com/alfazh123/image-editor/releases/tag/benchmark-editor)

## Demos

### Color transfer

<video src="https://alfazh123.github.io/image-editor/feature-demo/transfer-color.mp4 autoPlay muted loop playsInline controls width="100%"></video>

### Sharpen

<video src="https://alfazh123.github.io/image-editor/feature-demo/sharp.mp4" autoPlay muted loop playsInline controls width="100%"></video>

### Color Adjuster

<video src="https://alfazh123.github.io/image-editor/feature-demo/color.mp4" autoPlay muted loop playsInline controls width="100%"></video>

### Lightness

<video src="https://alfazh123.github.io/image-editor/feature-demo/light.mp4" autoPlay muted loop playsInline controls width="100%"></video>

## Links
- [Github Repository Web app](https://github.com/alfazh123/image-editor)
- [Github Repository WebAssembly implementation](https://github.com/alfazh123/RustEditor)
- [Github Repository Actix web implementation](https://github.com/alfazh123/actix-editor-img)
- [Demo Website](https://alfazh123.github.io/image-editor/)
- [wasm](https://webassembly.org/)