/**
 * Defines the local database for the CacheFirst strategy, using Dexie as the IndexedDB manager.
 */

import Dexie from 'dexie'

const db = new Dexie('localArnop')

db.version(2.1).stores({
  tickets: `++id, active, details, answered, escalated, client, city, 
            tickettype, assignated, ticketdetails, clienttype, escalatedoffice,
            channel, reboot, network, on, tvspec, technician, createdAt, updatedAt`,
  menus: '++id, name, icon, url, priority, alert, createdAt, updatedAt, publishedAt',
  tvspectypes: '++id, name, tvspecs'
})

export default db
