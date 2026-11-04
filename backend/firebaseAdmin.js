const fs = require('fs')
const path = require('path')

const {
    initializeApp,
    cert
} = require('firebase-admin/app')

const {
    getFirestore
} = require('firebase-admin/firestore')

const renderServiceAccountPath =
    '/etc/secrets/serviceAccountKey.json'

const localServiceAccountPath =
    path.join(
        __dirname,
        'serviceAccountKey.json'
    )

let serviceAccountPath

if (fs.existsSync(renderServiceAccountPath)) {
    serviceAccountPath =
        renderServiceAccountPath
} else {
    serviceAccountPath =
        localServiceAccountPath
}

const serviceAccount =
    JSON.parse(
        fs.readFileSync(
            serviceAccountPath,
            'utf8'
        )
    )

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

module.exports = db