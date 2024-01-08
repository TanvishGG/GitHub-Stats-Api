const axios = require('axios')
require('dotenv').config();
const {createCanvas,loadImage, registerFont } = require('canvas')
async function getLanguages(owner,token) {
try {
    const res = await axios({
        type:"get",
        url:`https://api.github.com/user/repos?per_page=100`,
        headers: {
            Accept:"application/vnd.github+json",
            Authorization: `token ${token}`
        }
    })
var languages = new Map()
var total = 0
 for(var i in res.data) {
    const res2 = await axios({
        type:"get",
        url: `https://api.github.com/repos/${owner}/${res.data[i].name}/languages`,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `token ${token}`
        }
    })
 for ( let key in res2.data) {
    languages.set(key, ((languages.get(key) || 0) + res2.data[key]))
    total += res2.data[key]
 }
 }
const sorted = [...languages].sort((a, b) => b[1] - a[1]);
languages = new Map(sorted);
const canvas = createCanvas(400, 80+languages.size*20);
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
    context.fillText(`${owner}'s Languages`, 20, 40);
    context.font = '16px Roboto';
    context.fillStyle = '#00FFFF'
    var height = 80;
    languages.forEach((value,key) => {
        context.fillText(`• ${key} : ${Math.round(value/total*100)}%`,20,height)
        height += 20
    })
    const avatar = await loadImage('./assets/github.png')
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

  context.drawImage(avatar, 275, 35,100,100)
  context.restore()
   const buffer = canvas.toBuffer('image/png');
   return buffer;
}
catch(e) {
    console.log(e)
    return null;
}
}
const router = require("express").Router()
router.get('/', async (req,res) => {
res.set('Content-Type', 'image/png');
res.set('Cache-control', 'private, max-age=0, no-cache')
res.send(await getLanguages(process.env.username,process.env.token))
})
module.exports = router; 