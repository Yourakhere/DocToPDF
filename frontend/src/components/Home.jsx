import React, { useState } from 'react'; 
import { FaFileWord } from "react-icons/fa";  
import axios from 'axios';

function Home() { 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [message, setMessage] = useState(""); 
  const [downloadError, setDownloadError] = useState("");  

  const handleFileChange = (e) => {     
    const file = e.target.files[0];
    setSelectedFile(file); 
    setMessage('');
    setDownloadError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile){ 
      setMessage('Please select a file');
      return; 
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://yourakhere-doctopdf.onrender.com/convertFile", 
        formData, 
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', selectedFile.name.replace(/\.[^/.]+$/, ".pdf"));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
 
      setSelectedFile(null);
      setMessage('✅ File converted and downloaded successfully.');
      setDownloadError('');
    } catch (error) {
      console.error(error);
      setMessage('');
      if (error.response && error.response.data && error.response.data.message) {
        setDownloadError('❌ ' + error.response.data.message);
      } else {
        setDownloadError('❌ Unexpected error, please try again.');
      }
    }
  };

  return (     
    <div className='max-w-2xl mx-auto p-6 md:px-40'>       
      <div className='flex h-screen flex-col justify-center items-center'>         
        <div className='border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg'>             
          <h1 className='text-3xl font-bold text-center mb-4'>Convert Word to PDF Online</h1>             
          <p className='text-sm text-center mb-5'>                 
            Easily convert Word documents to PDF format for free with our online Word to PDF converter.             
          </p>                   

          <div className='flex flex-col items-center space-y-4'>         
            <input 
              type="file"  
              accept='.doc, .docx' 
              onChange={handleFileChange} 
              className='hidden' 
              id='FileInput'
            />         
            <label 
              htmlFor="FileInput" 
              className='w-full flex items-center justify-center px-4 py-4 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white'
            >
              <FaFileWord className='text-2xl mr-3'/>         
              <span className='text-xl'>{selectedFile ? selectedFile.name : "Choose File"}</span>         
            </label>         
            <button 
              disabled={!selectedFile}  
              onClick={handleSubmit}
              className='text-white disabled:bg-gray-400 disabled:pointer-events-none bg-blue-500 hover:bg-blue-700 duration-700 font-bold px-4 py-2 rounded'
            >
              Convert File
            </button>    
            {message && <div className='text-green-500 text-center'>{message}</div>}         
            {downloadError && <div className='text-red-500 text-center'>{downloadError}</div>}      
          </div>        
        </div>        
      </div>       
    </div>
  ); 
}

export default Home;
