import { Util } from '../Util.js';

export class UtilTest extends Util {
    requestUrlToFilePath(url, repository, username) {
        let pURL = new URL(url);

        if (pURL.hostname === '127.0.0.1' && pURL.pathname.startsWith('/' + repository)) {
            pURL.pathname = pURL.pathname.slice(repository.length + 1);
            if (pURL.pathname === '/') pURL.pathname = '/index.html';

            return pURL.pathname;
        } else {
            return undefined;
        }
    }
}