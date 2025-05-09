# Word to PDF Converter

This is a simple React-based application that allows users to convert Word documents (`.doc` or `.docx`) into PDF format online. The app utilizes React for the frontend and axios to handle the communication with the backend. It's a user-friendly interface with real-time error handling and success messaging.

## Features

- Upload Word files (`.doc` and `.docx` formats) to convert them into PDF.
- Download the converted PDF directly.
- Error messages if the file conversion fails.
- Success message when the file is converted successfully.
- Mobile and desktop responsive design.

## Technologies Used

- React
- Axios
- React Icons (for Word icon)
- TailwindCSS (for styling)
- Blob API (to handle the download of the converted file)

## How to Use

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/word-to-pdf-converter.git
    cd word-to-pdf-converter
    ```

2. **Install dependencies**:
    Make sure you have `Node.js` installed, then run the following:
    ```bash
    npm install
    ```

3. **Start the application**:
    To start the development server, run:
    ```bash
    npm start
    ```
    The app will be available on `http://localhost:3000`.

4. **Convert Word files**:
    - Click the "Choose File" button to select a Word document.
    - Click the "Convert File" button to start the conversion process.
    - Once the conversion is successful, the file will automatically download as a PDF.
    - If there is an error, an error message will be displayed.

## Backend Requirements

The frontend is designed to interact with a backend service for the conversion process. The backend should have an endpoint that accepts file uploads and returns the converted PDF. 

Make sure to set up the following route on your backend:

- **POST /convertFile**: Accepts a Word document and returns the converted PDF file as a blob.

## Customization

- **Styling**: The application uses TailwindCSS. You can customize the design by modifying the Tailwind classes in the JSX components.
- **File Types**: This app currently accepts `.doc` and `.docx` files. You can expand the file input's `accept` attribute to include other formats.

## Troubleshooting

- **No file selected**: If no file is selected before clicking "Convert File", a message will inform you to choose a file.
- **Conversion Errors**: If the conversion fails, an error message will be displayed. Ensure your backend is running and correctly handling file uploads.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React and axios for building the frontend.
- TailwindCSS for beautiful and responsive design.
- React Icons for adding the Word icon.
