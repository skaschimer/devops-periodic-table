// src/pages/api/generate.tsx

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream', // Enable streaming
      }
    );

    // Set headers to enable Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the OpenAI response stream directly to the client
    openaiResponse.data.pipe(res);

    // Handle the end of the OpenAI stream
    openaiResponse.data.on('end', () => {
      res.end();
    });

    // Handle errors from the OpenAI stream
    openaiResponse.data.on('error', (error: any) => {
      console.error('Error in OpenAI stream:', error);
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Request failed' });
  }
};

export default handleRequest;
