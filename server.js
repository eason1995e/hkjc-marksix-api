const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/history', async (req, res) => {
  try {
    const url = 'https://bet.hkjc.com/contentserver/jcw/marksix/marksix.json';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      }
    });

    const rawData = response.data.marksix || response.data;
    const history = rawData.map(draw => ({
      id: draw.id || draw.drawNo,
      date: draw.date || draw.drawDate,
      numbers: (draw.drawnNumbers || draw.no || []).map(Number),
      special: Number(draw.extraNumber || draw.sno)
    }));

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "無法獲取馬會數據" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
