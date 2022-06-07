// Get all html elements
const alarmform = document.querySelector("#alarm-form"),
  min = document.querySelector("#tiempo"),
  btn = document.querySelector('#alarm-btn'),
  bar = document.querySelector('.progress-bar'),
  counter = document.querySelector('#counter')

// notifications title
const title = "ALARMA"

// listener for form submit
alarmform.addEventListener("submit", e => {
  e.preventDefault()
  min.setAttribute('readonly', true)
  min.style.borderColor = "gray"
  btn.setAttribute('disabled', true)
  const segds = Math.round(parseFloat(min.value) * 60)
  const nError = () => {
    console.error('Notification error');
  }
  const nShow = () => {
    console.log('Notification show');
  }
  const nClick = () => {
    console.log('Notification click');
  }
  const nClose = () => {
    console.log('Notification close');
  }
  const options = {
    body: `Ya han pasado ${min.value} minutos.`,
    icon: "dist/img/colortime-alarm-clock-black.png",
    vibrate: true,
    lang: 'en',
  }
  const nEvents = (n) => {
    n.onerror = nError
    n.onshow = nShow
    n.onclick = nClick
    n.onclose = nClose
  }
  let i = 0
  function notificar() {
    console.log('notificar()');
    // si no soporta notificaciones pongo alerta al respecto
    if (!("Notification" in window)) {
      alert("Este navegador no soporta las notificaciones del sistema")
    }

    // Comprobamos si ya nos habían dado permiso
    else if (Notification.permission === "granted") {
      console.log('permission granted')
      // Si esta correcto lanzamos la notificación
      const n = new Notification(title, options)
      nEvents(n)
      console.log(n);
      setTimeout(n.close.bind(n), 50000)
    }

    // Si no, tendremos que pedir permiso al usuario
    else if (Notification.permission !== "denied") {
      console.log('permission denied');
      Notification.requestPermission(function (permission) {
        console.log('asking permission');
        // Si el usuario acepta, lanzamos la notificación
        if (permission === "granted") {
          const n = new Notification(title, options)
          nEvents(n)
          setTimeout(n.close.bind(n), 50000)
        }
      })
    }

    else {
      console.error('Notification unknown error!');
    }
    min.removeAttribute('readonly')
    min.style.borderColor = ""
    btn.removeAttribute('disabled')
    counter.innerHTML = 0
    alarmform.reset()
    min.setAttribute('autofocus', true)
    bar.style.width = "0%"
  }

  function progress() {
    console.log('progress()');
    const clock = setInterval(() => {
      if (i == segds - 1 && clock) {
        notificar()
        clearInterval(clock)
        return
      }
      bar.style.width = `${(i + 1) * 100 / segds}%`
      i++
      counter.innerHTML = `${parseFloat(i)}<small>'s</small>`
      console.log(i)
    }, 1000);
  }

  console.log(`El tiempo elegido son ${segds} segundos.`)
  progress()
})
