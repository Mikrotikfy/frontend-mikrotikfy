export default (_, inject) => {
  inject('simpleTelegramCreate', input => simpleTelegramCreate(input))
  inject('simpleTelegramUpdate', input => simpleTelegramUpdate(input))
  inject('simpleTelegramUpdateTV', input => simpleTelegramUpdateTV(input))
  inject('simpleTelegramUpdatePlan', input => simpleTelegramUpdatePlan(input))
  inject('simpleTelegramSendToChat', input => simpleTelegramSendToChat(input))
  inject('simpleTelegramCreateTicket', input => simpleTelegramCreateTicket(input))
  inject('simpleTelegramCreateTicketTV', input => simpleTelegramCreateTicketTV(input))
  inject('simpleTelegramCreateTicketAdvance', input => simpleTelegramCreateTicketAdvance(input))
  inject('simpleTelegramCreateTicketAdvanceTv', input => simpleTelegramCreateTicketAdvanceTv(input))
  inject('simpleTelegramCreateRequest', input => simpleTelegramCreateRequest(input))
  inject('simpleTelegramAdminCreate', input => simpleTelegramAdminCreate(input))
  inject('simpleTelegramUpdateOffer', input => simpleTelegramUpdateOffer(input))
  inject('simpleTelegramUpdateDebt', input => simpleTelegramUpdateDebt(input))
  inject('simpleWhatsappSendToChat', input => simpleWhatsappSendToChat(input))
}

function simpleTelegramCreate ({ client, operator, telegramBots }) {
  const fetch = require('node-fetch')
  try {
    const bot = telegramBots.token
    const chatid = telegramBots.log
    const message = `🔵 CREADO 🔵\n${client.code}\n${client.name}\n${client.dni}\n${client.address}\n${client.neighborhood.name}\n${client.phone}\n${client.wifi_ssid}\n${client.wifi_password}\n${operator}`
    const req =
      'https://api.telegram.org/bot' +
      bot +
      '/sendMessage?chat_id=' +
      chatid +
      '&text=' +
      encodeURIComponent(message)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(req, options)
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
  const message = `✏️ ACTUALIZADO ✏️\n${client.code}\n${client.name}\n${client.dni}\n${client.addresses.at(-1).address}\n${client.addresses.at(-1).neighborhood.name}\n${client.phone}\n${client.city.name}\n${client.plan ? client.plan.name : client.offer.plan.name}\n${client.wifi_ssid}\n${client.wifi_password}\n${client.technology.name}\n${operator}\n${client.createdAt}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};

function simpleTelegramUpdateTV ({ client, operator, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.log
  const message = `✏️ TELEVISION ACTUALIZADO ✏️\n${client.code}\n${client.name}\n${client.dni}\n${client.addresses.at(-1).address}\n${client.addresses.at(-1).neighborhood.name}\n${client.phone}\n${client.city.name}\n\n${client.createdAt}\n${operator}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
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
    line1 = '📶 RECONEXIÓN 📶'
  } else {
    line1 = '🔄 CAMBIO DE PLAN 🔄'
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
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};

function simpleTelegramUpdateOffer ({ client, operator, offer, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.binnacle
  const line0 = '📝 CAMBIO DE TARIFA 📝'
  const line1 = offer.name
  const line2 = client.code
  const line3 = client.name
  const line4 = operator
  const message = `${line0}\n${line1}\n${line2}\n${line3}\n${line4}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};

function simpleTelegramUpdateDebt ({ client, operator, indebt, active, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.binnacle
  let line1 = ''
  if (indebt && active) {
    line1 = '🔴 DX POR MORA 🔴'
  } else if (!indebt && !active) {
    line1 = '✴️ RETIRO ✴️'
  } else {
    line1 = '📶 RECONEXIÓN 📶'
  }
  const line2 = client.code
  const line3 = client.name
  const line4 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};

function simpleTelegramSendToChat ({ client, tickettype, details, operator, user, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = user.telegramchatid
  const line1 = 'ℹ NUEVO TICKET ℹ️'
  const line2 = client.code
  const line3 = client.name
  const line4 = client.addresses.at(-1).address
  const line5 = client.addresses.at(-1).neighborhood.name
  const line6 = client.phone
  const line7 = tickettype
  const line8 = details
  const line9 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\nInforma: ${line9}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};
function simpleWhatsappSendToChat ({ tickettype, client, user, token }) {
  const fetch = require('node-fetch')
  const line1 = tickettype
  const line2 = client.code
  const line3 = client.name
  const line4 = client.addresses.at(-1).address
  const line5 = client.addresses.at(-1).neighborhood.name
  const line6 = client.phone
  const message = `${line1} - ${line2} - ${line3} - ${line4} - ${line5} - ${line6}`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(
      {
        messaging_product: 'whatsapp',
        to: `57${user.phone}`,
        type: 'template',
        template: {
          name: 'technician_update',
          language: {
            code: 'es'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: `${message}`
                }
              ]
            }
          ]
        }
      }
    )
  }

  fetch('https://graph.facebook.com/v15.0/100480202798133/messages', options)
    .catch(function (err) {
      return err
    })
};
function simpleTelegramCreateTicket ({ client, tickettype, details, operator, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.chat
  const line1 = 'ℹ NUEVO TICKET ℹ️'
  const line2 = client.code
  const line3 = client.name
  const line4 = client.addresses.at(-1).address
  const line5 = client.addresses.at(-1).neighborhood.name
  const line6 = client.phone
  const line7 = tickettype
  const line8 = details
  const line9 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\nInforma: ${line9}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};
function simpleTelegramCreateTicketTV ({ client, tickettype, details, operator, telegramBots }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.tvchat
  const line1 = 'ℹ NUEVO TICKET ℹ️'
  const line2 = client.code
  const line3 = client.name
  const line4 = client.addresses.at(-1).address
  const line5 = client.addresses.at(-1).neighborhood.name
  const line6 = client.phone
  const line7 = tickettype
  const line8 = details
  const line9 = operator
  const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\nInforma: ${line9}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
};
function simpleTelegramCreateTicketAdvance (payload) {
  const fetch = require('node-fetch')
  const bot = payload.telegramBots.token
  const chatid = payload.telegramBots.chat
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(payload.message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
}
function simpleTelegramCreateTicketAdvanceTv (payload) {
  const fetch = require('node-fetch')
  const bot = payload.telegramBots.token
  const chatid = payload.telegramBots.tvchat
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(payload.message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
}

function simpleTelegramCreateRequest ({ client, telegramBots, operator }) {
  const fetch = require('node-fetch')
  const bot = telegramBots.token
  const chatid = telegramBots.binnacle
  const message = `SOLICITUD DE ACTIVACION\n${client.code}\n${client.name}\n${client.dni}\n${client.addresses.at(-1).address}\n${client.addresses.at(-1).neighborhood.name}\n${client.phone}\n\n${operator}\n${client.createdAt}`
  const req =
    'https://api.telegram.org/bot' +
    bot +
    '/sendMessage?chat_id=' +
    chatid +
    '&text=' +
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
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
    encodeURIComponent(message)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(req, options)
    .catch(function (err) {
      return err
    })
}
