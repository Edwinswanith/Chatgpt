import { useState, useEffect } from "react";
import api from '../api/apiUrl'

const useFetch = (url, refetch, sessionId) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsPending(true);
                let requestUrl = url;
                if (url === '/history' && sessionId) {
                    requestUrl = `/history?sessionId=${sessionId}`;
                }
                const response = await api.get(requestUrl);
                // Ensure each message in history has a highlights array
                const historyWithHighlights = response.data.map(msg => ({
                    ...msg,
                    highlights: msg.highlights || []
                }));
                setData(historyWithHighlights);
                setIsPending(false);
                setError(null);
            } catch (err) {
                setError(err.message);
                setIsPending(false);
            }
        }
        fetchData();
    }, [url, refetch, sessionId]);

    return {data, setData, isPending, error};
}

export default useFetch