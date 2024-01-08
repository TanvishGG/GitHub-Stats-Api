const axios = require('axios');
require('dotenv').config();
const { createCanvas, loadImage,registerFont } = require('canvas');
async function generateGitHubStatsImage(username, token) {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
 const commits = await axios({
          method: "get",
          url: `https://api.github.com/search/commits?q=author:${username}`,
          headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
          Authorization: `token ${token}`,
    } 
           });
const issues = await axios({ method: "get",
url: "https://api.github.com/issues?owned=true&per_page=100&state=open",
headers: { Accept: "application/vnd.github+json",
 Authorization: `token ${token}`}})
    const { name, followers, public_repos,avatar_url,total_private_repos } = response.data;
    const canvas = createCanvas(400, 180);
    registerFont('./assets/Roboto-Medium.ttf', {family: 'Roboto'})
    const context = canvas.getContext('2d');
    context.fillStyle = '#fffff'
    context.fillRect(0,0,canvas.width,canvas.height)
    const borderWidth = 5;
    const gradientColor1 = '#2539e8'; 
    const gradientColor2 = '#00FFFF';
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, gradientColor1);
    gradient.addColorStop(1, gradientColor2);
    context.strokeStyle = gradient;
    context.lineWidth = borderWidth;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#5656fc'
    context.font = 'bold 20px Roboto';
    context.fillText(`${name}'s Stats`, 20, 40);
    context.font = '16px Roboto';
    context.fillStyle = '#00FFFF'
    context.fillText(`• Followers: ${followers || 0}`, 20, 80);
    context.fillText(`• Public Repos: ${public_repos || 0}`, 20, 100);
    context.fillText(`• Private Repos: ${total_private_repos || 0}`,20, 120);
    context.fillText(`• Contributions: ${commits.data.total_count || 0}`, 20, 140);
    context.fillText(`• Issues: ${issues.data.length || 0}`,20,160)
  const avatar = await loadImage(avatar_url);
  const avatarWidth = 100;
  const avatarHeight = 100
  const avatarRadius = 45
  context.save();
  context.beginPath();
  context.arc(
    canvas.width - avatarWidth - 20 + avatarRadius, 
    (canvas.height - avatarHeight) / 2 + avatarRadius, 
    avatarRadius, 
    0, 
    Math.PI * 2
  );
  context.closePath();
  context.clip();

  context.drawImage(avatar, 275, 40,100,100)
  context.restore()
    const buffer = canvas.toBuffer('image/png');
    return buffer;
  } catch (error) {
    console.log(error)
    return null;
  }
}
const router = require('express').Router();
router.get('/', async (req, res) => {
res.set('Content-Type', 'image/png');
res.set('Cache-control','private, max-age=0, no-cache')
res.send(await generateGitHubStatsImage(process.env.username,process.env.token));
})
module.exports = router;