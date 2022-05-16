export default (_, inject) => {
  inject('simpleTelegramCreate', input => simpleTelegramCreate(input))
  inject('simpleTelegramUpdate', input => simpleTelegramUpdate(input))
  inject('simpleTelegramUpdatePlan', input => simpleTelegramUpdatePlan(input))
  inject('simpleTelegramCreateTicket', input => simpleTelegramCreateTicket(input))
  inject('simpleTelegramCreateTicketAdvance', input => simpleTelegramCreateTicketAdvance(input))
  inject('simpleTelegramCreateRequest', input => simpleTelegramCreateRequest(input))
  inject('simpleTelegramAdminCreate', input => simpleTelegramAdminCreate(input))
}

function simpleTelegramCreate ({ client, operator, telegramBots }) {
  const fetch = require('node-fetch')
  try {
    const bot = telegramBots.token
    const chatid = telegramBots.log
    const message = `CREADO\n${client.code}\n${client.name}\n${client.dni}\n${client.address}\n${client.phone}\n${client.wifi_ssid}\n${client.wifi_password}\n${operator}`
    const req =
      'https://api.telegram.org/bot' +
      bot +
      '/sendMessage?chat_id=' +
      chatid +
      '&text=' +
      encodeURIComponent(sanitizeString(message))
    fetch(req)
      .catch(function (err) {
        return err
      })
  } catch (error) {
    return error
  }
};

function simpleTelegramUpdate ({ client, operator, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.log
  const message = `ACTUALIZADO\n${client.code}\n${client.name}\n${client.dni}\n${client.address}\n${client.neighborhood.name}\n${client.phone}\n${client.city.name}\n${client.plan.name}\n${client.wifi_ssid}\n${client.wifi_password}\n${client.technology.name}\nNAP-ONU: ${client.nap_onu_address}\nPOTENCIA: ${client.opticalPower}dBm\n${operator}\n${client.createdAt}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(sanitizeString(message))
  fetch(req)
    .catch(function (err) {
      return err
    })
};

function simpleTelegramUpdatePlan ({ client, operator, isRx, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.binnacle
  let line1 = ''
  if (isRx) {
    line1 = 'RECONEXIÓN'
  } else {
    line1 = 'CAMBIO DE PLAN'
  }
  const line2 = client.code
  const line3 = client.name
  const line4 = client.plan.name
  const line5 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(sanitizeString(message))
  fetch(req)
    .catch(function (err) {
      return err
    })
};

function simpleTelegramCreateTicket ({ client, tickettype, details, neighborhood, operator, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.chat
  const line1 = 'ℹ NUEVO TICKET ℹ️'
  const line2 = client.code
  const line3 = sanitizeString(client.name)
  const line4 = sanitizeString(client.address)
  const line5 = neighborhood.name
  const line6 = client.phone
  const line7 = tickettype
  const line8 = sanitizeString(details)
  const line9 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\nInforma: ${line9}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  fetch(req)
    .catch(function (err) {
      return err
    })
};
function simpleTelegramCreateTicketAdvance ({ client, ticket, status, details, operator, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.chat
  let line1 = ''
  if (status) {
    line1 = '✅ CIERRE DE TICKET ✅'
  } else {
    line1 = 'AVANCE DE TICKET'
  }
  const line2 = sanitizeString(client.code)
  const line3 = sanitizeString(client.name)
  const line4 = sanitizeString(client.address)
  const line5 = sanitizeString(client.phone)
  const line6 = sanitizeString(ticket.tickettype.name)
  const line7 = sanitizeString(details)
  let line8 = ''
  if (status) {
    line8 = 'CASO CERRADO'
  } else {
    line8 = 'CASO ACTIVO'
  }
  const line9 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\n${line9}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  fetch(req)
    .catch(function (err) {
      return err
    })
}

function simpleTelegramCreateRequest ({ client, telegramBots, operator }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.binnacle
  const message = `SOLICITUD DE ACTIVACION\n${client.code}\n${client.name}\n${client.dni}\n${client.address}\n${client.neighborhood.name}\n${client.phone}\n\n${operator}\n${client.createdAt}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(sanitizeString(message))
  fetch(req)
    .catch(function (err) {
      return err
    })
}

function simpleTelegramAdminCreate ({ client, telegramBots, operator }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.binnacle
  const message = `APROBADO\n${client.code}\n${client.name}\n${client.dni}\n${client.address}\n${client.neighborhood.name}\n${client.phone}\n\n${operator}\n${client.createdAt}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(sanitizeString(message))
  fetch(req)
    .catch(function (err) {
      return err
    })
}

function sanitizeString (str) {
  const res1 = str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
  const res2 = res1.replace(/[^a-z0-9áéíóúñü \n@ñ,_-]/gim, '')
  return res2
}
