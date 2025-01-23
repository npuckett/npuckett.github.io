const URScriptConverter = () => {
    const [urscript, setUrscript] = React.useState('');
    
    const deg2rad = (deg) => deg * Math.PI / 180;
  
    const convertToURScript = (data) => {
      let script = '';
      let homed = false;
      
      data.forEach(row => {
        const time = parseFloat(row.Time);
        const a1 = parseFloat(row[' Axis 1']);
        const a2 = parseFloat(row[' Axis 2']); 
        const a3 = parseFloat(row[' Axis 3']);
        const a4 = parseFloat(row[' Axis 4']);
        const a5 = parseFloat(row[' Axis 5']);
        const a6 = parseFloat(row[' Axis 6']);
        
        const joints = [a1,a2,a3,a4,a5,a6].map(deg2rad);
        
        if (!homed) {
          script += `movej([${joints}],0.25,0.25,0,0)\n`;
          homed = true;
        }
        
        script += `servoj([${joints}],0,0,0.04,0.1,300)\n`;
      });
      
      script += 'stopj(0.5)';
      return script;
    };
  
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const script = convertToURScript(results.data);
          setUrscript(script);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    };
  
    const handleDownload = () => {
      const blob = new Blob([urscript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robot_motion.script';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
  
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Maya Mimic CSV to UR10E Script Converter</h1>
        <div className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>
  
          {urscript && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{urscript}</pre>
              </div>
              
              <button
                onClick={handleDownload}
                className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download URScript
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  ReactDOM.render(<URScriptConverter />, document.getElementById('root'));