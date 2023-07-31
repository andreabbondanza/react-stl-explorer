# react-stl-explorer

[![npm](https://img.shields.io/npm/v/react-stl-explorer?logo=npm)](https://www.npmjs.com/package/react-stl-explorer)

An embeddable STL viewer for React applications.

<img src="https://github.com/JMax45/react-stl-explorer/assets/36378436/eeba86cb-0a1d-48f1-a217-0f5fa7df998f" alt="viewer screenshot" width="600">

### Installation

Install the library via npm:

```bash
npm install react-stl-explorer
```

### Usage

Import the `StlExplorer` component and start using it in your React application:

```jsx
import React from 'react';
import StlExplorer from 'react-stl-explorer';

const MyComponent = () => {
  return (
    <div>
      <h1>My 3D Model Viewer</h1>
      <StlExplorer />
    </div>
  );
};

export default MyComponent;
```

### Development

This library uses the Storybook environment for development. To start working on react-stl-explorer, follow these steps:

1. Clone this Git repository:

```bash
git clone https://github.com/JMax45/react-stl-explorer
cd react-stl-explorer
```

2. Install the dependencies:

```bash
npm install
```

3. Start the Storybook development server:

```bash
npm run storybook
```

Open your browser and navigate to `http://localhost:6006` to view the Storybook interface, where you can interact with the components.

### Future Customizability

Currently, react-stl-explorer acts as a simple STL viewer, allowing users to drag and drop their own STL files for visualization. In the future, you can expect additional options to tailor the behavior to suit your specific use cases.

### Contributing

Contributions are welcome! If you find any issues or want to enhance the library, please open a pull request.

### License

This project is licensed under the [MIT License](LICENSE).
