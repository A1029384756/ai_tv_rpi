const socket = new WebSocket('ws://' + location.host)
const image = document.getElementById('image')
const image2 = document.getElementById('image2')

socket.addEventListener('message', async (event) => {
  console.log(event)
  image.src = 'http://localhost:7978/image.png?' + new Date().getTime()
  image2.src = 'http://localhost:7978/image2.png?' + new Date().getTime()
  await sleep(2000)
  imageTransition(event.data)
})

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const imageTransition = (selectedImage) => {
  // Set image to url and fade between
  if (selectedImage === 'true') { 
    console.log('Showing img 2')
    image2.style.opacity = 1
  } else { 
    console.log('Showing img 1')
    image2.style.opacity = 0
  }
}
