// pages/api/facebook.js
import axios from 'axios';
import { facebookConfig } from '../../config';

export default async function handler(req, res) {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v18.0/105878691726156?fields=posts{full_picture,message,created_time},name,picture&access_token=${facebookConfig.accessToken}`
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Facebook feed:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
}
