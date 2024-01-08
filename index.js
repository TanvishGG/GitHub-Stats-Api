const express = require('express');
require('dotenv').config();
if(!process.env.token || !process.env.username) {
 console.error('Mising Token or Username');
 process.exit(1)
}
const app = express();
const gitStats = require('./routes/git-stats');
const gitLanguage = require('./routes/git-language')
app.use(express.json())
app.get('/',function(req,res) {
  res.sendFile(__dirname + '/index.html');
  })
app.use('/git-stats',gitStats)
app.use('/git-language',gitLanguage)
app.use((req, res) => {
res.status(404).send('Page not found');
    });
app.listen(8080, () => {
    console.log('Server started');
});