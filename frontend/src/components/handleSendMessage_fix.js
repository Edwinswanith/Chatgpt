  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0 && pdfFiles.length === 0) return;

    const userMessage = { 
      sender: 'user', 
      text: input, 
      image_data: files.map(file => file.data), 
      pdf_text_content: pdfFiles.map(file => file.name) 
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);

    try {
        const response = await api.post('/chat', { 
            message: input, 
            sessionId: sessionId, 
            images: files.map(file => file.data), 
            pdfs: pdfFiles.map(file => file.data) 
        });

        // Handle regular JSON response instead of streaming
        if (response.data && response.data.response) {
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', text: response.data.response, image_data: [], pdf_text_content: [] }
            ]);
        } else {
            throw new Error('No response data received');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'bot', text: 'Error: Could not get a response.', image_data: [], pdf_text_content: [] }
        ]);
    } finally {
        setLoading(false);
        setInput('');
        setFiles([]);
        setPdfFiles([]);
    }
  };
