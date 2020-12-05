const path        = require('path');
const root    = path.join(__dirname, '../');
const bin     = path.join(root, 'bin');
const storage = path.join(root, 'storage');
const tmp     = path.join(storage, 'tmp');
const db      = path.join(storage, 'database');
const cache   = path.join(storage, 'cache');
const dl      = path.join(storage, 'downloads');
const rsrc    = path.join(root, 'resources');
const cmds    = path.join(root, 'commands');

module.exports = { root, bin, storage, tmp, db, cache, dl, rsrc, cmds, };