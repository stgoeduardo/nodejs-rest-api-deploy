// Esto no es valido, no se pueden importar json en ESModules asi...
// import movies from './movies.json'
// ...deberia de ser asi:
// import movies from './movies.json' assert { type: 'json' }// en la terminal nos muestra un experimental warning que esto, asi como lo declaramos, puede cambiar en el futuro....y ya cambio!
// entonces lo correcto es, en lugar de usar assert, usar with, ese si ya no va a cambiar, pero with apenas va a salir...ES EL FUTURO
// import movies from './movies.json' with { type: 'json' }
// finalmente, hay dos formas para hacerlo, la primera es con fs
/* import fs from 'node:fs'
const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8')) */
// pero el buen midudev recomienda mejor usar el require que proporciona node:module apartir de createRequire
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
export const readJSON = (path) => require(path)
